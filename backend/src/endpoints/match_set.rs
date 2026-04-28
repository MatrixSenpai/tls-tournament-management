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
        tournament::Tournament,
        team::Team,
        game::Game,
        match_set::*,
    }
};

pub fn match_routes(cfg: &mut ServiceConfig) {
    cfg.service(
        scope("/matches")
            .service(get_matches)
            .service(get_match_by_id)
            .service(get_tournament_by_match_id)
            .service(get_teams_by_match_id)
            .service(get_games_by_match_id)
            .service(post_match)
            .service(patch_match)
            .service(delete_match)
    );
}

#[get("")]
async fn get_matches(db: Data<Database>) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let results = db.find_all::<Match>(CollectionName::Match, None).await?;
    Ok(Json(results))
}

#[get("{id}")]
async fn get_match_by_id(
    db: Data<Database>,
    id: Path<ObjectId>
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let result = db.find::<Match>(CollectionName::Match, id.into_inner()).await?;
    Ok(Json(result))
}

#[get("{id}/tournament")]
async fn get_tournament_by_match_id(
    db: Data<Database>,
    id: Path<ObjectId>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let match_item = db.find::<Match>(CollectionName::Match, id.into_inner()).await?;
    let tournament = db.find::<Tournament>(CollectionName::Tournament, match_item.tournament_id).await?;
    Ok(Json(tournament))
}

#[get("{id}/teams")]
async fn get_teams_by_match_id(
    db: Data<Database>,
    id: Path<ObjectId>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let match_item = db.find::<Match>(CollectionName::Match, id.into_inner()).await?;
    let teams = db.find_all::<Team>(
        CollectionName::Team,
        Some(doc! { "_id": { "$in": [match_item.team_one_id, match_item.team_two_id] } }),
    ).await?;
    Ok(Json(teams))
}

#[get("{id}/games")]
async fn get_games_by_match_id(
    db: Data<Database>,
    id: Path<ObjectId>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let match_item = db.find::<Match>(CollectionName::Match, id.into_inner()).await?;
    let games = db.find_all::<Game>(
        CollectionName::Game,
        Some(doc! { "match_id": match_item.internal_id }),
    ).await?;
    Ok(Json(games))
}

#[post("")]
async fn post_match(
    db: Data<Database>,
    body: Json<CreateMatch>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let match_item = Match {
        internal_id: ObjectId::new(),
        tournament_id: body.tournament_id,
        team_one_id: body.team_one_id,
        team_two_id: body.team_two_id,
        scheduled_match_start: body.scheduled_match_start,
        state: body.state,
        number_of_games: body.number_of_games,
    };
    db.create(CollectionName::Match, &match_item).await?;
    Ok(Json(match_item))
}

#[patch("{id}")]
async fn patch_match(
    db: Data<Database>,
    id: Path<ObjectId>,
    body: Json<UpdateMatch>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    db.update(CollectionName::Match, id.into_inner(), body.into_inner()).await?;
    Ok(HttpResponse::Ok())
}

#[delete("{id}")]
async fn delete_match(
    db: Data<Database>,
    id: Path<ObjectId>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    db.delete::<Match>(CollectionName::Match, id.into_inner()).await?;
    Ok(HttpResponse::Ok())
}