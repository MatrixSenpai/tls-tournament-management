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
use crate::database::Database;
use schema::{
    api::*,
    database::Series as DBSeries,
};

pub fn series_routes(cfg: &mut ServiceConfig) {
    cfg.service(
        scope("/series")
            .service(get_series)
            .service(get_series_by_id)
            .service(post_series)
            .service(patch_series)
            .service(delete_series)
    );
}

#[get("")]
async fn get_series(db: Data<Database>) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let results: Vec<Series> = db.find_all::<DBSeries>(None).await?
        .into_iter()
        .map(|v| v.into())
        .collect();
    Ok(Json(results))
}

#[get("{id}")]
async fn get_series_by_id(
    db: Data<Database>,
    id: Path<ObjectId>
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let result: Series = db.find::<DBSeries>(id.into_inner()).await?.into();
    Ok(Json(result))
}

#[post("")]
async fn post_series(
    db: Data<Database>,
    body: Json<CreateSeries>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let series = DBSeries::new(
        body.start,
        body.state,
        body.kind,
        body.result,
        body.drafter_link.clone(),
        body.tournament_id,
        body.team_one_id,
        body.team_two_id,
    );
    db.create(&series).await?;
    Ok(Json(series))
}

#[patch("{id}")]
async fn patch_series(
    db: Data<Database>,
    id: Path<ObjectId>,
    body: Json<UpdateSeries>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    db.update(id.into_inner(), &body.into_inner()).await?;
    Ok(HttpResponse::Ok())
}

#[delete("{id}")]
async fn delete_series(
    db: Data<Database>,
    id: Path<ObjectId>,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    db.delete::<DBSeries>(id.into_inner()).await?;
    Ok(HttpResponse::Ok())
}