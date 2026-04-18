use chrono::{DateTime, Utc};
use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Clone, Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct Tournament {
    #[serde(rename = "_id")]
    pub internal_id: ObjectId,
    pub riot_id: i32,
    pub name: String,
    pub start_date: DateTime<Utc>,
    pub state: TournamentState,
}

#[derive(Clone, Debug, Serialize, Deserialize, TS, Eq, Ord, PartialOrd, PartialEq)]
#[ts(export)]
pub enum TournamentState {
    Upcoming,
    Running,
    Ended,
}

#[derive(Clone, Debug, Deserialize, TS)]
#[ts(export)]
pub struct CreateTournament {
    pub name: String,
    pub start_date: DateTime<Utc>,
}
#[derive(Clone, Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct UpdateTournament {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start_date: Option<DateTime<Utc>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub state: Option<TournamentState>,
}