use std::sync::Arc;
use futures::stream::StreamExt;
use anyhow::Context as _;
use riven::consts::RegionalRoute;
use chrono::Utc;
use mongodb::bson::{
    doc, oid::ObjectId,
};
use actix_web::{
    get, post, patch, delete, Responder, HttpResponse,
    web::{
        Json, Path, Data, ServiceConfig,
        scope,
    }
};
use crate::database::Database;
use schema::{
    database::{
        TournamentState,
        Tournament as DBTournament,
    },
    api::*
};

pub fn tournament_routes(cfg: &mut ServiceConfig) {
    cfg.service(
        scope("/tournaments")
            .service(get_tournaments)
            .service(get_tournament_by_id)
            .service(post_tournament)
            .service(patch_tournament)
            .service(delete_tournament)
    );
}

#[get("")]
async fn get_tournaments(db: Data<Database>) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let results: Vec<Tournament> = db.find_all::<DBTournament>(None)
        .await?
        .into_iter()
        .map(|v| v.into())
        .collect();
    Ok(Json(results))
}

#[get("{id}")]
async fn get_tournament_by_id(
    db: Data<Database>,
    id: Path<ObjectId>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let result: Tournament = db.find::<DBTournament>(id.into_inner()).await?.into();
    Ok(Json(result))
}

#[post("")]
async fn post_tournament(
    db: Data<Database>,
    api: Data<Arc<riven::RiotApi>>,
    config: Data<crate::ServerConfig>,
    body: Json<CreateTournament>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    debug!("{body:?}");
    let tournament_id = if config.use_stub {
        let params = riven::models::tournament_stub_v5::TournamentRegistrationParametersV5 {
            provider_id: config.provider_id,
            name: Some(body.name.clone()),
        };
        api.tournament_stub_v5().register_tournament(
            RegionalRoute::AMERICAS,
            &params
        ).await?
    } else {
        let params = riven::models::tournament_v5::TournamentRegistrationParametersV5 {
            provider_id: config.provider_id,
            name: Some(body.name.clone()),
        };
        api.tournament_v5().register_tournament(
            RegionalRoute::AMERICAS,
            &params
        ).await?
    };

    let state = if Utc::now().ge(&body.start_date) { TournamentState::Running } else { TournamentState::Upcoming };
    let tournament = body.clone().to_tournament(tournament_id as usize);

    db.create(&tournament).await?;
    Ok(Json(tournament))
}

#[patch("{id}")]
async fn patch_tournament(
    db: Data<Database>,
    id: Path<ObjectId>,
    body: Json<UpdateTournament>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    db.update(id.into_inner(), &body.into_inner()).await?;
    Ok(HttpResponse::Ok())
}

#[delete("{id}")]
async fn delete_tournament(
    db: Data<Database>,
    id: Path<ObjectId>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    db.delete::<DBTournament>(id.into_inner()).await?;
    Ok(HttpResponse::Ok())
}