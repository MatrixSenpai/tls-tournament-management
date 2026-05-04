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

#[derive(Clone, Debug, serde::Deserialize, ts_rs::TS)]
#[ts(export)]
pub struct DateFilter {
    pub direction: DateFilterDirection,
    pub date: chrono::DateTime<chrono::Utc>,
}

#[derive(Copy, Clone, Debug, serde::Deserialize, Ord, PartialOrd, Eq, PartialEq, Hash, ts_rs::TS)]
#[ts(export)]
pub enum DateFilterDirection {
    Before,
    After,
    On,
}