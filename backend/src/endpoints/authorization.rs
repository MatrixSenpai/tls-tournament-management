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
use actix_web::web::Query;
use crate::database::Database;
use schema::{
    api::*,
    database::User as DBUser,
    database::CollectionType,
};

#[derive(Clone, Debug, serde::Deserialize)]
struct AuthCallbackResponse {
    code: String,
    state: String,
}

#[derive(Clone, Debug, serde::Deserialize)]
struct TokenExchangeResponse {
    access_token: String,
    expires_in: usize,
    refresh_token: String,
    scope: String,
}

#[derive(Clone, Debug, serde::Deserialize)]
struct DiscordUser {
    id: String,
    username: String,
}

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
pub struct TokenClaims {
    pub sub: String,
    pub usr: String,
    pub adm: bool,
}

#[get("/auth/finalize")]
pub async fn auth_route(
    database: Data<Database>,
    auth_query: Query<AuthCallbackResponse>
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    debug!("Auth response: {auth_query:?}");

    let mut body = std::collections::HashMap::new();
    body.insert("grant_type", "authorization_code");
    body.insert("code", &auth_query.code);
    body.insert("redirect_uri", "http://localhost:8214/auth/callback");

    let client = reqwest::Client::new();
    let response: TokenExchangeResponse = client.post("https://discord.com/api/oauth2/token")
        .header("Content-Type", "application/x-www-form-urlencoded")
        .basic_auth(&std::env::var("DISCORD_CLIENT_ID").unwrap(), Some(&std::env::var("DISCORD_CLIENT_SECRET").unwrap()))
        .form(&body)
        .send().await?
        .json().await?;

    debug!("Token exchange response: {response:?}");

    let user: DiscordUser = client.get("https://discord.com/api/users/@me")
        .bearer_auth(response.access_token)
        .send().await?
        .json().await?;

    debug!("User collected from discord: {user:?}");

    let db_user_collection = database.db_handle.collection::<DBUser>(DBUser::collection_name());

    let db_user = if let Some(user) = db_user_collection.find_one(doc! { "discord_id": &user.id }).await? {
        user
    } else {
        let user = DBUser::new(user.username, user.id, false);
        db_user_collection.insert_one(&user).await?;
        user
    };

    let claims = TokenClaims {
        sub: db_user.discord_id.clone(),
        usr: db_user.discord_name.clone(),
        adm: db_user.admin,
    };
    let token = jsonwebtoken::encode(
        &jsonwebtoken::Header::default(),
        &claims,
        &jsonwebtoken::EncodingKey::from_secret(std::env::var("INTERNAL_SECRET")?.as_ref()),
    )?;

    Ok(token)
}
