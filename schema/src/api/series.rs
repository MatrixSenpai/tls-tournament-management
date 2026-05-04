use bson::oid::ObjectId;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use super::{
    DateFilter,
    Tournament,
    Team,
    Game
};
use crate::database::{
    SeriesState, SeriesKind, SeriesWinner,
    Series as DBSeries,
    CollectionType,
};

#[derive(Debug, Clone, Serialize, TS)]
#[ts(export)]
pub struct Series {
    pub id: String,

    pub start: DateTime<Utc>,
    pub state: SeriesState,
    pub kind: SeriesKind,
    pub result: SeriesWinner,
    pub drafter_link: Option<String>,

    pub tournament: Option<Tournament>,
    pub team_one: Option<Team>,
    pub team_two: Option<Team>,
    pub games: Vec<Game>,
}
impl From<DBSeries> for Series {
    fn from(value: DBSeries) -> Self {
        Self {
            id: value.id.to_string(),
            start: value.start,
            state: value.state,
            kind: value.kind,
            result: value.result,
            drafter_link: value.drafter_link,
            tournament: None,
            team_one: None,
            team_two: None,
            games: Vec::new(),
        }
    }
}

#[derive(Clone, Debug, Deserialize, TS)]
#[ts(export)]
pub struct CreateSeries {
    pub start: DateTime<Utc>,
    pub state: SeriesState,
    pub kind: SeriesKind,
    pub result: SeriesWinner,
    pub drafter_link: Option<String>,
    pub tournament_id: ObjectId,
    pub team_one_id: ObjectId,
    pub team_two_id: ObjectId,
}
impl CreateSeries {
    pub fn to_series(self) -> DBSeries {
        DBSeries::new(
            self.start,
            self.state,
            self.kind,
            self.result,
            self.drafter_link,
            self.tournament_id,
            self.team_one_id,
            self.team_two_id,
        )
    }
}

#[derive(Default, Clone, Debug, Serialize, Deserialize, TS)]
#[serde(default)]
#[ts(export)]
pub struct UpdateSeries {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start: Option<DateTime<Utc>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub state: Option<SeriesState>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub kind: Option<SeriesKind>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub result: Option<SeriesWinner>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub drafter_link: Option<String>,
}
impl CollectionType for UpdateSeries {
    fn collection_name() -> &'static str {
        DBSeries::collection_name()
    }
}

#[derive(Default, Clone, Debug, Deserialize, TS)]
#[serde(default)]
#[ts(export)]
pub struct IncludeSeriesParams {
    all: bool,
    tournament: bool,
    teams: bool,
    games: bool,
}

#[derive(Default, Clone, Debug, Deserialize, TS)]
#[serde(default)]
#[ts(export)]
pub struct FilterSeriesParams {
    start: Option<DateFilter>,
    state: Option<Vec<SeriesState>>,
}