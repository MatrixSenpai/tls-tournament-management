use bson::oid::ObjectId;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use super::{Team, Series, DateFilter};
use crate::database::{
    TournamentState,
    Tournament as DBTournament,
    CollectionType,
};

#[derive(Clone, Debug, Serialize, TS)]
#[ts(export)]
pub struct Tournament {
    pub id: String,

    pub name: String,
    pub start_date: DateTime<Utc>,
    pub end_date: Option<DateTime<Utc>>,
    pub state: TournamentState,
    pub win_team_id: Option<String>,

    pub teams: Vec<Team>,
    pub series: Vec<Series>,
}
impl From<DBTournament> for Tournament {
    fn from(value: DBTournament) -> Self {
        Self {
            id: value.id.to_string(),
            name: value.name.to_string(),
            start_date: value.start_date,
            end_date: value.end_date,
            state: value.state,
            win_team_id: value.win_team_id.map(|v| v.to_string()),
            teams: Vec::new(),
            series: Vec::new(),
        }
    }
}

#[derive(Clone, Debug, Deserialize, TS)]
#[ts(export)]
pub struct CreateTournament {
    pub name: String,
    pub start_date: DateTime<Utc>,
    pub end_date: Option<DateTime<Utc>>,
    pub state: TournamentState,
    pub win_team_id: Option<ObjectId>,
}
impl CreateTournament {
    pub fn to_tournament(self, riot_tournament_id: usize) -> DBTournament {
        DBTournament::new(
            riot_tournament_id,
            self.name,
            self.start_date,
            self.end_date,
            self.state,
            self.win_team_id,
        )
    }
}

#[derive(Default, Clone, Debug, Serialize, Deserialize, TS)]
#[serde(default)]
#[ts(export)]
pub struct UpdateTournament {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start_date: Option<DateTime<Utc>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub end_date: Option<DateTime<Utc>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub state: Option<TournamentState>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub win_team_id: Option<ObjectId>,
}
impl CollectionType for UpdateTournament {
    fn collection_name() -> &'static str {
        DBTournament::collection_name()
    }
}

#[derive(Default, Clone, Debug, Deserialize, TS)]
#[serde(default)]
#[ts(export)]
pub struct IncludeTournamentParams {
    all: bool,
    teams: bool,
    series: bool,
}

#[derive(Default, Clone, Debug, Deserialize, TS)]
#[serde(default)]
#[ts(export)]
pub struct FilterTournamentParams {
    partial_name: Option<String>,
    start_date: Option<DateFilter>,
    end_date: Option<DateFilter>,
    state: Vec<TournamentState>,
}