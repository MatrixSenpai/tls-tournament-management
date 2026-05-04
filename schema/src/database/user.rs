use bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use super::{CollectionName, CollectionType};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct User {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub discord_name: String,
    pub discord_id: String,
    pub admin: bool,
}

impl User {
    pub fn new(
        discord_name: String,
        discord_id: String,
        admin: bool,
    ) -> Self {
        Self {
            id: ObjectId::new(),
            discord_name, discord_id, admin,
        }
    }
}

impl CollectionType for User {
    fn collection_name() -> &'static str {
        CollectionName::User.as_str()
    }
}