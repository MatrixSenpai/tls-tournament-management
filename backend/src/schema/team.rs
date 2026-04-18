use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Clone, Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct Team {
    #[serde(rename = "_id")]
    pub internal_id: ObjectId,
    pub tournament_ids: Vec<ObjectId>,
    pub name: String,
    pub short_name: String,
    pub active: bool,
}

#[derive(Clone, Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct CreateTeam {
    pub tournament_ids: Vec<ObjectId>,
    pub name: String,
    pub short_name: String,
    pub active: bool,
}
#[derive(Clone, Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct UpdateTeam {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tournament_ids: Option<Vec<ObjectId>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub short_name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub active: Option<bool>,
}