use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Clone, Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct Player {
    #[serde(rename = "_id")]
    pub internal_id: ObjectId,
    pub team_id: ObjectId,
    pub riot_name: String,
    pub riot_puuid: String,
    pub discord_name: Option<String>,
    pub role: Role,
    pub is_team_captain: bool,
}

#[derive(Copy, Clone, Debug, Serialize, Deserialize, TS, Eq, Ord, PartialOrd, PartialEq)]
#[ts(export)]
pub enum Role {
    Coach, Substitute,
    Top,
    Jungle,
    Mid,
    ADC,
    Support,
}

#[derive(Clone, Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct CreatePlayer {
    pub team_id: ObjectId,
    pub riot_account_name: String,
    pub discord_name: Option<String>,
    pub role: Role,
    pub is_team_captain: bool,
}
#[derive(Clone, Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct UpdatePlayer {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub team_id: Option<ObjectId>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub role: Option<Role>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_team_captain: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub discord_name: Option<String>,
}