use bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use super::{Tournament, Player, Series};
use crate::database::{
    Team as DBTeam,
    CollectionType,
};

#[derive(Clone, Debug, Serialize, TS)]
#[ts(export)]
pub struct Team {
    pub id: String,

    pub name: String,
    pub short_name: String,
    pub active: bool,

    pub tournaments: Vec<Tournament>,
    pub players: Vec<Player>,
    pub series: Vec<Series>,
}
impl From<DBTeam> for Team {
    fn from(value: DBTeam) -> Self {
        Self {
            id: value.id.to_string(),
            name: value.name,
            short_name: value.short_name,
            active: value.active,
            tournaments: Vec::new(),
            players: Vec::new(),
            series: Vec::new(),
        }
    }
}

#[derive(Clone, Debug, Deserialize, TS)]
#[ts(export)]
pub struct CreateTeam {
    name: String,
    short_name: String,
    active: bool,
    participating_tournament_ids: Vec<ObjectId>,
}
impl CreateTeam {
    pub fn to_team(self) -> DBTeam {
        DBTeam::new(
            self.name,
            self.short_name,
            self.active,
            self.participating_tournament_ids,
        )
    }
}

#[derive(Default, Clone, Debug, Serialize, Deserialize, TS)]
#[serde(default)]
#[ts(export)]
pub struct UpdateTeam {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub short_name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub active: Option<bool>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    pub participating_tournament_ids: Vec<ObjectId>,
}
impl CollectionType for UpdateTeam {
    fn collection_name() -> &'static str {
        DBTeam::collection_name()
    }
}

#[derive(Default, Clone, Debug, Deserialize, TS)]
#[serde(default)]
#[ts(export)]
pub struct IncludeTeamParams {
    all: bool,
    tournaments: bool,
    players: bool,
    series: bool,
}

#[derive(Default, Clone, Debug, Deserialize, TS)]
#[serde(default)]
#[ts(export)]
pub struct FilterTeamParams {
    pub partial_name: Option<String>,
    pub partial_short_name: Option<String>,
    pub active: Option<bool>,
}