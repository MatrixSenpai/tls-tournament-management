use serde::{Deserialize, Serialize};
use crate::database::{User as DBUser, CollectionType};

#[derive(Clone, Debug, Serialize)]
pub struct User {
    pub id: String,
    pub discord_name: String,
    pub admin: bool,
}
impl From<DBUser> for User {
    fn from(value: DBUser) -> Self {
        Self {
            id: value.id.to_string(),
            discord_name: value.discord_name,
            admin: value.admin,
        }
    }
}

#[derive(Default, Clone, Debug, Serialize, Deserialize)]
#[serde(default)]
pub struct UpdateUser {
    pub admin: Option<bool>,
}
impl CollectionType for UpdateUser {
    fn collection_name() -> &'static str {
        DBUser::collection_name()
    }
}

#[derive(Default, Clone, Debug, Deserialize)]
#[serde(default)]
pub struct FilterUserParams {
    partial_discord_name: Option<String>,
    admin: Option<bool>,
}