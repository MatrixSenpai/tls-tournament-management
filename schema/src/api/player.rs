use bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use super::{Team, Game};
use crate::database::{
    Role,
    Player as DBPlayer,
    CollectionType,
};

#[derive(Clone, Debug, Serialize, TS)]
#[ts(export)]
pub struct Player {
    pub id: String,
    pub riot_name: String,
    pub discord_name: Option<String>,
    pub role: Role,
    pub team_captain: bool,

    pub team: Option<Team>,
    pub games: Vec<Game>,
}
impl From<DBPlayer> for Player {
    fn from(value: DBPlayer) -> Self {
        Self {
            id: value.id.to_string(),
            riot_name: String::new(),
            discord_name: value.discord_name,
            role: value.role,
            team_captain: value.team_captain,
            team: None,
            games: Vec::new(),
        }
    }
}

#[derive(Clone, Debug, Deserialize, TS)]
#[ts(export)]
pub struct CreatePlayer {
    pub riot_name: String,
    pub discord_name: Option<String>,
    pub role: Role,
    pub team_captain: bool,
    pub team_id: ObjectId,
}
impl CreatePlayer {
    pub fn to_player(self, riot_puuid: String) -> DBPlayer {
        DBPlayer::new(
            self.team_id,
            riot_puuid,
            self.discord_name,
            self.role,
            self.team_captain,
        )
    }
}

#[derive(Default, Clone, Debug, Serialize, Deserialize, TS)]
#[serde(default)]
#[ts(export)]
pub struct UpdatePlayer {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub discord_name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub role: Option<Role>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub team_captain: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub team_id: Option<ObjectId>,
}
impl CollectionType for UpdatePlayer {
    fn collection_name() -> &'static str {
        DBPlayer::collection_name()
    }
}

#[derive(Default, Clone, Debug, Deserialize, TS)]
#[serde(default)]
#[ts(export)]
pub struct IncludePlayerParams {
    all: bool,
    team: bool,
    games: bool,
}

#[derive(Default, Clone, Debug, Deserialize, TS)]
#[serde(default)]
#[ts(export)]
pub struct FilterPlayerParams {
    pub partial_riot_name: Option<String>,
    pub partial_discord_name: Option<String>,
    pub role: Option<Role>,
    pub team_captain: Option<bool>,
}