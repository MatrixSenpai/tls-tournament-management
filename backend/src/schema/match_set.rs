use chrono::{DateTime, Utc};
use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Clone, Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct Match {
    #[serde(rename = "_id")]
    pub internal_id: ObjectId,
    pub tournament_id: ObjectId,
    pub team_one_id: ObjectId,
    pub team_two_id: ObjectId,
    pub scheduled_match_start: Option<DateTime<Utc>>,
    pub state: MatchState,
    pub number_of_games: usize,
}

#[derive(Copy, Clone, Debug, Serialize, Deserialize, TS, Eq, Ord, PartialOrd, PartialEq)]
#[ts(export)]
pub enum MatchState {
    Upcoming,
    Running,
    Ended,
}

#[derive(Clone, Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct CreateMatch {
    pub tournament_id: ObjectId,
    pub team_one_id: ObjectId,
    pub team_two_id: ObjectId,
    pub scheduled_match_start: Option<DateTime<Utc>>,
    pub state: MatchState,
    pub number_of_games: usize,
}
#[derive(Clone, Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct UpdateMatch {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub scheduled_match_start: Option<DateTime<Utc>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub state: Option<MatchState>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub number_of_games: Option<usize>,
}