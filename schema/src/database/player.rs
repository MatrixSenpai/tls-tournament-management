use bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use super::{CollectionName, CollectionType};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Player {
    #[serde(rename = "_id")]
    pub id: ObjectId,

    pub team_id: ObjectId,

    pub riot_puuid: String,
    pub discord_name: Option<String>,

    pub role: Role,
    pub team_captain: bool,
}

impl Player {
    pub fn new(
        team_id: ObjectId,
        riot_puuid: String,
        discord_name: Option<String>,
        role: Role,
        team_captain: bool,
    ) -> Self {
        Self {
            id: ObjectId::new(),
            team_id,
            riot_puuid, discord_name,
            role, team_captain,
        }
    }
}

impl CollectionType for Player {
    fn collection_name() -> &'static str {
        CollectionName::Player.as_str()
    }
}

#[derive(Copy, Clone, Debug, Serialize, Deserialize, Ord, PartialOrd, Eq, PartialEq, Hash, ts_rs::TS)]
#[ts(export)]
pub enum Role {
    Coach,
    Top,
    Jungle,
    Mid,
    ADC,
    Support,
    Substitute,
}