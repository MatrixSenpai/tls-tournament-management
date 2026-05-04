use bson::oid::ObjectId;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use super::{CollectionName, CollectionType};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Tournament {
    #[serde(rename = "_id")]
    pub id: ObjectId,

    pub riot_tournament_id: usize,

    pub name: String,
    pub start_date: DateTime<Utc>,
    pub end_date: Option<DateTime<Utc>>,
    pub state: TournamentState,
    pub win_team_id: Option<ObjectId>,
}

impl Tournament {
    pub fn new(
        riot_tournament_id: usize,
        name: String,
        start_date: DateTime<Utc>,
        end_date: Option<DateTime<Utc>>,
        state: TournamentState,
        win_team_id: Option<ObjectId>,
    ) -> Self {
        Self {
            id: ObjectId::new(),
            riot_tournament_id,
            name, start_date, end_date, state, win_team_id,
        }
    }
}

impl CollectionType for Tournament {
    fn collection_name() -> &'static str {
        CollectionName::Tournament.as_str()
    }
}

#[derive(Copy, Clone, Debug, Serialize, Deserialize, Ord, PartialOrd, Eq, PartialEq, Hash, ts_rs::TS)]
#[ts(export)]
pub enum TournamentState {
    Upcoming,
    Running,
    Ended,
}