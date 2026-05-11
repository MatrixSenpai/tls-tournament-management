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
    pub iss: String,
    pub adm: bool,
    pub exp: chrono::DateTime<chrono::Utc>,
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
        iss: "TLS Tournament Admin".to_string(),
        adm: db_user.admin,
        exp: chrono::Utc::now().checked_add_days(chrono::Days::new(30)).unwrap(),
    };
    let token = jsonwebtoken::encode(
        &jsonwebtoken::Header::default(),
        &claims,
        &jsonwebtoken::EncodingKey::from_secret(std::env::var("INTERNAL_SECRET")?.as_ref()),
    )?;

    Ok(token)
}

#[get("/auth/revalidate")]
pub async fn revalidate(
    database: Data<Database>,
    token: actix_web_httpauth::extractors::bearer::BearerAuth,
) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let mut validation = jsonwebtoken::Validation::new(jsonwebtoken::Algorithm::HS256);
    validation.set_required_spec_claims(&["iss"]);
    validation.validate_exp = false;
    validation.set_issuer(&["TLS Tournament Admin"]);

    let decoded = jsonwebtoken::decode::<TokenClaims>(
        &token.token(),
        &jsonwebtoken::DecodingKey::from_secret(std::env::var("INTERNAL_SECRET")?.as_ref()),
        &validation
    )?;

    let id = decoded.claims.sub;
    let users = database.find_all::<DBUser>(Some(doc! { "discord_id": id })).await?;
    let db_user = users.first().unwrap();

    let claims = TokenClaims {
        sub: db_user.discord_id.clone(),
        usr: db_user.discord_name.clone(),
        iss: "TLS Tournament Admin".to_string(),
        adm: db_user.admin,
        exp: chrono::Utc::now().checked_add_days(chrono::Days::new(30)).unwrap(),
    };
    let token = jsonwebtoken::encode(
        &jsonwebtoken::Header::default(),
        &claims,
        &jsonwebtoken::EncodingKey::from_secret(std::env::var("INTERNAL_SECRET")?.as_ref()),
    )?;

    Ok(token)
}