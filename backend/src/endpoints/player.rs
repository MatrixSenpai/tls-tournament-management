use std::sync::Arc;
use futures::stream::StreamExt;
use anyhow::Context as _;
use riven::consts::RegionalRoute;
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
    api::*,
    database::Player as DBPlayer,
};

pub fn player_routes(cfg: &mut ServiceConfig) {
    cfg.service(
        scope("/players")
            .service(get_players)
            .service(get_player_by_id)
            .service(post_player)
            .service(patch_player)
            .service(delete_player)
    );
}

#[get("")]
async fn get_players(db: Data<Database>) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let results: Vec<Player> = db.find_all::<DBPlayer>(None).await?
        .into_iter()
        .map(|v| v.into())
        .collect();
    Ok(Json(results))
}

#[get("{id}")]
async fn get_player_by_id(
    db: Data<Database>,
    id: Path<ObjectId>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let result: Player = db.find::<DBPlayer>(id.into_inner()).await?.into();
    Ok(Json(result))
}

#[post("")]
async fn post_player(
    db: Data<Database>,
    api: Data<Arc<riven::RiotApi>>,
    body: Json<CreatePlayer>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let (game_name, tag_line) = body.riot_name.split_once("#")
        .ok_or(anyhow::Error::msg("No tagline found in provided id!"))?;
    let riot_player_data = api.account_v1().get_by_riot_id(
        RegionalRoute::AMERICAS,
        game_name, tag_line,
    ).await?.ok_or(anyhow::Error::msg("Riot account not found!"))?;

    let player = body.clone().to_player(riot_player_data.puuid);
    db.create(&player).await?;
    Ok(Json(player))
}

#[patch("{id}")]
async fn patch_player(
    db: Data<Database>,
    id: Path<ObjectId>,
    body: Json<UpdatePlayer>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    db.update(id.into_inner(), &body.into_inner()).await?;
    Ok(HttpResponse::Ok())
}

#[delete("{id}")]
async fn delete_player(
    db: Data<Database>,
    id: Path<ObjectId>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    db.delete::<DBPlayer>(id.into_inner()).await?;
    Ok(HttpResponse::Ok())
}