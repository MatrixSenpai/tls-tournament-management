use bson::oid::ObjectId;
use chrono::{DateTime, Utc};
// use riven::models::{
//     tournament_v5::{TournamentCodeV5, TournamentGamesV5, LobbyEventV5},
//     match_v5::{Match, Timeline},
// };
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use super::{DateFilter, Series, Team, Player};
use crate::database::{
    GameState,
    Game as DBGame,
    CollectionType,
};

#[derive(Clone, Debug, Serialize, TS)]
#[ts(export)]
pub struct Game {
    pub id: String,

    pub state: GameState,
    pub start: Option<DateTime<Utc>>,

    pub series: Option<Series>,
    pub winner: Option<Team>,

    pub blue_side: Option<Team>,
    pub blue_side_players: Vec<Player>,
    pub red_side: Option<Team>,
    pub red_side_players: Vec<Player>,

    // pub riot_match_information: Option<TournamentCodeV5>,
    // pub riot_tournament_game_information: Option<TournamentGamesV5>,
    // pub riot_lobby_events: Vec<LobbyEventV5>,
    // pub riot_match_data: Option<Match>,
    // pub riot_match_timeline: Option<Timeline>,
}
impl From<DBGame> for Game {
    fn from(value: DBGame) -> Self {
        Self {
            id: value.id.to_string(),
            state: value.state,
            start: value.start,
            series: None,
            winner: None,
            blue_side: None,
            blue_side_players: Vec::new(),
            red_side: None,
            red_side_players: Vec::new(),
            // riot_match_information: None,
            // riot_tournament_game_information: None,
            // riot_lobby_events: Vec::new(),
            // riot_match_data: None,
            // riot_match_timeline: None,
        }
    }
}

#[derive(Clone, Debug, Deserialize, TS)]
#[ts(export)]
pub struct CreateGame {
    pub series_id: ObjectId,
    pub winner_id: Option<ObjectId>,
    pub blue_side_id: Option<ObjectId>,
    pub red_side_id: Option<ObjectId>,
    pub state: GameState,
    pub start: Option<DateTime<Utc>>,

    pub riot_match_id: Option<String>,
    pub riot_should_generate_tournament_code: bool,
}
impl CreateGame {
    pub fn to_game(self, riot_tournament_code: Option<String>) -> DBGame {
        DBGame::new(
            self.series_id,
            self.winner_id,
            self.blue_side_id,
            self.red_side_id,
            self.state,
            self.start,
            riot_tournament_code,
            self.riot_match_id,
        )
    }
}

#[derive(Default, Clone, Debug, Serialize, Deserialize, TS)]
#[serde(default)]
#[ts(export)]
pub struct UpdateGame {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub state: Option<GameState>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start: Option<DateTime<Utc>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub riot_match_id: Option<String>,
}
impl CollectionType for UpdateGame {
    fn collection_name() -> &'static str {
        DBGame::collection_name()
    }
}

#[derive(Default, Clone, Debug, Deserialize, TS)]
#[serde(default)]
#[ts(export)]
pub struct IncludeGameParams {
    pub all: bool,

    pub series: bool,
    pub winner: bool,
    pub blue_side_team: bool,
    pub blue_side_players: bool,
    pub red_side_team: bool,
    pub red_side_players: bool,

    pub riot_all_information: bool,
    pub riot_match_information: bool,
    pub riot_tournament_game_information: bool,
    pub riot_lobby_events: bool,
    pub riot_match_data: bool,
    pub riot_match_timeline: bool,
}

#[derive(Default, Clone, Debug, Deserialize, TS)]
#[serde(default)]
#[ts(export)]
pub struct FilterGameParams {
    pub state: Option<GameState>,
    pub start: Option<DateFilter>,
    pub any_side_team_id: Option<ObjectId>,
}