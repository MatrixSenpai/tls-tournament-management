use bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use super::{CollectionType, CollectionName};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Team {
    #[serde(rename = "_id")]
    pub id: ObjectId,

    pub name: String,
    pub short_name: String,
    pub active: bool,

    pub participating_tournament_ids: Vec<ObjectId>,
}

impl Team {
    pub fn new(
        name: String,
        short_name: String,
        active: bool,
        participating_tournament_ids: Vec<ObjectId>,
    ) -> Self {
        Self {
            id: ObjectId::new(),
            name, short_name, active,
            participating_tournament_ids,
        }
    }
}

impl CollectionType for Team {
    fn collection_name() -> &'static str {
        CollectionName::Team.as_str()
    }
}