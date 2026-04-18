#![allow(unused, dead_code)]

mod schema;
mod endpoints;
mod database;

#[macro_use]
extern crate log;

use std::sync::Arc;
use anyhow::Context as _;
use actix_cors::Cors;
use actix_web::{App, Error, HttpResponse, HttpServer, Responder, http::header, middleware, web::{self, Data}, HttpRequest};
use riven::consts::{RegionalRoute, TournamentRegion};
use riven::RiotApi;

#[derive(Debug, Copy, Clone, serde::Serialize, serde::Deserialize)]
pub struct ServerConfig {
    provider_id: i32,
}

async fn setup_tournament(api: Arc<RiotApi>, collection: mongodb::Collection<ServerConfig>) -> anyhow::Result<ServerConfig> {
    use riven::models::tournament_stub_v5::ProviderRegistrationParametersV5;
    let provider_data = ProviderRegistrationParametersV5 {
        region: TournamentRegion::NA,
        url: std::env::var("RIOT_API_CALLBACK_ENDPOINT")?,
    };
    let provider_id = api.tournament_stub_v5().register_provider_data(
        RegionalRoute::AMERICAS, &provider_data
    ).await?;

    let config = ServerConfig { provider_id };
    collection.replace_one(
        mongodb::bson::doc! { "provider_id": provider_id },
        &config
    ).with_options(
        Some(mongodb::options::ReplaceOptions::builder().upsert(true).build())
    ).await?;

    Ok(config)
}
// #[cfg(not(debug_assertions))]
// async fn setup_tournament(api: Arc<RiotApi>) -> anyhow::Result<i32> {
//     use riven::models::tournament_v5::ProviderRegistrationParametersV5;
//     let provider_data = ProviderRegistrationParametersV5 {
//         region: TournamentRegion::NA,
//         url: std::env::var("RIOT_API_CALLBACK_ENDPOINT")?,
//     };
//     api.tournament_v5().register_provider_data(
//         RegionalRoute::AMERICAS, &provider_data
//     ).await.context("Could not create tournament provider")
// }

#[actix_web::main]
async fn main() -> anyhow::Result<()> {
    dotenv::dotenv().ok();
    pretty_env_logger::init_timed();

    let api = Arc::new(RiotApi::new(std::env::var("RIOT_API_KEY")?));

    let mongo = mongodb::Client::with_uri_str(std::env::var("DB_URL")?).await?;
    let db = mongo.database("tournament_management");
    let db = database::Database::new(db);

    let server_config = setup_tournament(api.clone(), db.db_handle.collection::<ServerConfig>("server_configuration")).await?;
    info!("Tournament provider ID retrieved: {server_config:?}");

    info!("Server coming online!");
    HttpServer::new(move || {
        let db = db.clone();
        let base_dir = std::env::var("FRONTEND_FILES").unwrap();

        App::new()
            .app_data(Data::new(db))
            .app_data(Data::new(server_config))
            .app_data(Data::new(api.clone()))
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header()
                    .supports_credentials()
                    .max_age(3600)
            )
            .wrap(middleware::Logger::default())
            .configure(endpoints::api_routes)
            .service(
                actix_web_lab::web::spa()
                    .index_file(base_dir.clone() + "/index.html")
                    .static_resources_location(base_dir)
                    .finish()
            )
    })
        .workers(if cfg!(debug_assertions) { 1 } else { 10 })
        .bind("0.0.0.0:8214")?
        .run()
        .await
        .context("Could not start HTTP server")
}