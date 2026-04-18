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
use crate::{
    database::*,
    schema::{
        player::*,
        team::Team,
    }
};

pub fn player_routes(cfg: &mut ServiceConfig) {
    cfg.service(
        scope("/players")
            .service(get_players)
            .service(get_player_by_id)
            .service(get_team_by_player_id)
            .service(post_player)
            .service(patch_player)
            .service(delete_player)
    );
}

#[get("")]
async fn get_players(db: Data<Database>) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let results = db.find_all::<Player>(CollectionName::Player, None).await?;
    Ok(Json(results))
}

#[get("{id}")]
async fn get_player_by_id(
    db: Data<Database>,
    id: Path<ObjectId>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let result = db.find::<Player>(CollectionName::Player, id.into_inner()).await?;
    Ok(Json(result))
}

#[get("{id}/team")]
async fn get_team_by_player_id(
    db: Data<Database>,
    id: Path<ObjectId>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let player = db.find::<Player>(CollectionName::Player, id.into_inner()).await?;
    let team = db.find::<Team>(CollectionName::Team, player.team_id).await?;
    Ok(Json(team))
}

#[post("")]
async fn post_player(
    db: Data<Database>,
    api: Data<Arc<riven::RiotApi>>,
    body: Json<CreatePlayer>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let (game_name, tag_line) = body.riot_account_name.split_once("#")
        .ok_or(anyhow::Error::msg("No tagline found in provided id!"))?;
    let riot_player_data = api.account_v1().get_by_riot_id(
        RegionalRoute::AMERICAS,
        game_name, tag_line,
    ).await?.ok_or(anyhow::Error::msg("Riot account not found!"))?;

    let player = Player {
        internal_id: ObjectId::new(),
        team_id: body.team_id,
        riot_name: body.riot_account_name.clone(),
        riot_puuid: riot_player_data.puuid.clone(),
        discord_name: body.discord_name.clone(),
        role: body.role,
        is_team_captain: body.is_team_captain,
    };
    db.create(CollectionName::Player, &player).await?;
    Ok(Json(player))
}

#[patch("{id}")]
async fn patch_player(
    db: Data<Database>,
    id: Path<ObjectId>,
    body: Json<UpdatePlayer>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    db.update(CollectionName::Player, id.into_inner(), body.into_inner()).await?;
    Ok(HttpResponse::Ok())
}

#[delete("{id}")]
async fn delete_player(
    db: Data<Database>,
    id: Path<ObjectId>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    db.delete::<Player>(CollectionName::Player, id.into_inner()).await?;
    Ok(HttpResponse::Ok())
}