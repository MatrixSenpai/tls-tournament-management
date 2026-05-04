use bson::oid::ObjectId;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use super::{CollectionName, CollectionType};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Series {
    #[serde(rename = "_id")]
    pub id: ObjectId,

    pub start: DateTime<Utc>,
    pub state: SeriesState,
    pub kind: SeriesKind,
    pub result: SeriesWinner,
    pub drafter_link: Option<String>,

    pub tournament_id: ObjectId,
    pub team_one_id: ObjectId,
    pub team_two_id: ObjectId,
}

impl Series {
    pub fn new(
        start: DateTime<Utc>,
        state: SeriesState,
        kind: SeriesKind,
        result: SeriesWinner,
        drafter_link: Option<String>,
        tournament_id: ObjectId,
        team_one_id: ObjectId,
        team_two_id: ObjectId,
    ) -> Self {
        Self {
            id: ObjectId::new(),
            start, state, kind, result, drafter_link,
            tournament_id, team_one_id, team_two_id,
        }
    }
}

impl CollectionType for Series {
    fn collection_name() -> &'static str {
        CollectionName::Series.as_str()
    }
}

#[derive(Copy, Clone, Debug, Serialize, Deserialize, Ord, PartialOrd, Eq, PartialEq, Hash, ts_rs::TS)]
#[ts(export)]
pub enum SeriesState {
    Upcoming,
    Running,
    Ended,
    Forfeit,
}

#[derive(Copy, Clone, Debug, Serialize, Deserialize, Ord, PartialOrd, Eq, PartialEq, Hash, ts_rs::TS)]
#[ts(export)]
pub enum SeriesKind {
    BestOfOne,
    BestOfThree,
    BestOfFive,
}

#[derive(Copy, Clone, Debug, Serialize, Deserialize, Ord, PartialOrd, Eq, PartialEq, Hash, ts_rs::TS)]
#[ts(export)]
pub enum SeriesWinner {
    None,
    One,
    Two,
}