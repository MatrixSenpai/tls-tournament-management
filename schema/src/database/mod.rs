mod tournament;
mod team;
mod player;
mod series;
mod game;
mod user;

pub use tournament::*;
pub use team::*;
pub use player::*;
pub use series::*;
pub use game::*;
pub use user::*;

use serde::{Deserialize, Serialize};
use serde::de::DeserializeOwned;

#[derive(Copy, Clone, Debug, Serialize, Deserialize, Ord, PartialOrd, Eq, PartialEq, Hash)]
pub enum CollectionName {
    Tournament,
    Team,
    Player,
    Series,
    Game,
    User,
}
impl CollectionName {
    pub const fn as_str(&self) -> &str {
        match self {
            Self::Tournament => "tournament",
            Self::Team => "team",
            Self::Player => "player",
            Self::Series => "series",
            Self::Game => "game",
            Self::User => "user",
        }
    }
}

pub trait CollectionType: Serialize + DeserializeOwned + Send + Sync {
    fn collection_name() -> &'static str;
}
