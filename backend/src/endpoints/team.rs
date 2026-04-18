use std::sync::Arc;
use futures::stream::StreamExt;
use anyhow::Context as _;
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
        team::*,
        tournament::Tournament,
        player::Player,
    }
};

pub fn team_routes(cfg: &mut ServiceConfig) {
    cfg.service(
        scope("/teams")
            .service(get_teams)
            .service(get_team_by_id)
            .service(get_tournaments_by_team_id)
            .service(get_players_by_team_id)
            .service(get_team_captain_by_team_id)
            .service(post_team)
            .service(patch_team)
            .service(delete_team)
    );
}

#[get("")]
async fn get_teams(db: Data<Database>) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let results = db.find_all::<Team>(CollectionName::Team, None).await?;
    Ok(Json(results))
}

#[get("{id}")]
async fn get_team_by_id(
    db: Data<Database>,
    id: Path<ObjectId>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let result = db.find::<Team>(CollectionName::Team, id.into_inner()).await?;
    Ok(Json(result))
}

#[get("{id}/tournaments")]
async fn get_tournaments_by_team_id(
    db: Data<Database>,
    id: Path<ObjectId>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let team = db.find::<Team>(CollectionName::Team, id.into_inner()).await?;
    let tournaments = db.find_all::<Tournament>(
        CollectionName::Tournament,
        Some(doc! { "_id": { "$in": team.tournament_ids } }),
    ).await?;
    Ok(Json(tournaments))
}

#[get("{id}/players")]
async fn get_players_by_team_id(
    db: Data<Database>,
    id: Path<ObjectId>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let results = db.find_all::<Player>(
        CollectionName::Player,
        Some(doc! { "team_id": id.into_inner() }),
    ).await?;
    Ok(Json(results))
}

#[get("{id}/captain")]
async fn get_team_captain_by_team_id(
    db: Data<Database>,
    id: Path<ObjectId>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let query = doc! {
        "$and": [
            { "team_id": id.into_inner() },
            { "is_team_captain": true }
        ]
    };
    let player = db.db_handle.collection::<Player>(&CollectionName::Player.to_string())
        .find_one(query).await?.ok_or(anyhow::Error::msg("Cannot find player!"))?;
    Ok(Json(player))
}

#[post("")]
async fn post_team(
    db: Data<Database>,
    body: Json<CreateTeam>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let team = Team {
        internal_id: ObjectId::new(),
        tournament_ids: body.tournament_ids.clone(),
        name: body.name.clone(),
        short_name: body.short_name.clone(),
        active: body.active,
    };
    db.create(CollectionName::Team, &team).await?;
    Ok(Json(team))
}

#[patch("{id}")]
async fn patch_team(
    db: Data<Database>,
    id: Path<ObjectId>,
    body: Json<UpdateTeam>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    db.update(CollectionName::Team, id.into_inner(), body.into_inner()).await?;
    Ok(HttpResponse::Ok())
}

#[delete("{id}")]
async fn delete_team(
    db: Data<Database>,
    id: Path<ObjectId>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    db.delete::<Team>(CollectionName::Team, id.into_inner()).await?;
    Ok(HttpResponse::Ok())
}