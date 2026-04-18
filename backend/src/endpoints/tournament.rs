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
use crate::{
    database::*,
    schema::{
        tournament::*,
        team::Team,
        match_set::Match,
    }
};

pub fn tournament_routes(cfg: &mut ServiceConfig) {
    cfg.service(
        scope("/tournaments")
            .service(get_tournaments)
            .service(get_tournament_by_id)
            .service(get_teams_by_tournament_id)
            .service(get_matches_by_tournament_id)
            .service(post_tournament)
            .service(patch_tournament)
            .service(delete_tournament)
    );
}

#[get("")]
async fn get_tournaments(db: Data<Database>) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let results = db.find_all::<Tournament>(CollectionName::Tournament, None).await?;
    Ok(Json(results))
}

#[get("{id}")]
async fn get_tournament_by_id(
    db: Data<Database>,
    id: Path<ObjectId>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let result = db.find::<Tournament>(CollectionName::Tournament, id.into_inner()).await?;
    Ok(Json(result))
}

#[get("{id}/teams")]
async fn get_teams_by_tournament_id(
    db: Data<Database>,
    id: Path<ObjectId>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let results = db.find_all::<Team>(
        CollectionName::Team,
        Some(doc! { "tournament_ids": id.into_inner() }),
    ).await?;
    Ok(Json(results))
}

#[get("{id}/matches")]
async fn get_matches_by_tournament_id(
    db: Data<Database>,
    id: Path<ObjectId>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let results = db.find_all::<Match>(
        CollectionName::Match,
        Some(doc! { "tournament_id": id.into_inner() }),
    ).await?;
    Ok(Json(results))
}

#[post("")]
async fn post_tournament(
    db: Data<Database>,
    api: Data<Arc<riven::RiotApi>>,
    config: Data<crate::ServerConfig>,
    body: Json<CreateTournament>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let tournament_id = if cfg!(debug_assertions) {
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
    let tournament = Tournament {
        internal_id: ObjectId::new(),
        riot_id: tournament_id,
        name: body.name.clone(),
        start_date: body.start_date,
        state,
    };

    db.create(CollectionName::Tournament, &tournament).await?;
    Ok(Json(tournament))
}

#[patch("{id}")]
async fn patch_tournament(
    db: Data<Database>,
    id: Path<ObjectId>,
    body: Json<UpdateTournament>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    db.update(CollectionName::Tournament, id.into_inner(), body.into_inner()).await?;
    Ok(HttpResponse::Ok())
}

#[delete("{id}")]
async fn delete_tournament(
    db: Data<Database>,
    id: Path<ObjectId>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    db.delete::<Tournament>(CollectionName::Tournament, id.into_inner()).await?;
    Ok(HttpResponse::Ok())
}