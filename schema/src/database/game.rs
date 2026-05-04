use bson::oid::ObjectId;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use super::{CollectionName, CollectionType};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Game {
    #[serde(rename = "_id")]
    pub id: ObjectId,

    pub series_id: ObjectId,
    pub winner_id: Option<ObjectId>,

    pub blue_side_id: Option<ObjectId>,
    pub red_side_id: Option<ObjectId>,

    pub state: GameState,
    pub start: Option<DateTime<Utc>>,

    pub riot_tournament_code: Option<String>,
    pub riot_match_id: Option<String>,
}

impl Game {
    pub fn new(
        series_id: ObjectId,
        winner_id: Option<ObjectId>,
        blue_side_id: Option<ObjectId>,
        red_side_id: Option<ObjectId>,
        state: GameState,
        start: Option<DateTime<Utc>>,
        riot_tournament_code: Option<String>,
        riot_match_id: Option<String>,
    ) -> Self {
        Self {
            id: ObjectId::new(),
            series_id, winner_id, blue_side_id, red_side_id,
            state, start,
            riot_tournament_code, riot_match_id,
        }
    }
}

impl CollectionType for Game {
    fn collection_name() -> &'static str {
        CollectionName::Game.as_str()
    }
}

#[derive(Copy, Clone, Debug, Serialize, Deserialize, Ord, PartialOrd, Eq, PartialEq, Hash, ts_rs::TS)]
#[ts(export)]
pub enum GameState {
    Upcoming,
    Running,
    Ended,
    Forfeit,
}