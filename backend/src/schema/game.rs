use chrono::{DateTime, Utc};
use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Clone, Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct Game {
    #[serde(rename = "_id")]
    pub internal_id: ObjectId,
    pub match_id: ObjectId,
    pub riot_tournament_code: Option<String>,
    pub riot_match_id: Option<String>,
    pub state: GameState,
    pub winning_team_id: Option<ObjectId>,
    pub participants: Vec<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize, TS, Eq, Ord, PartialOrd, PartialEq)]
#[ts(export)]
pub enum GameState {
    Upcoming,
    Running,
    Ended,
    Forfeit,
}

#[derive(Clone, Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct CreateGame {
    pub match_id: ObjectId,
}
#[derive(Clone, Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct UpdateGame {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub state: Option<GameState>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub winning_team_id: Option<ObjectId>,
}