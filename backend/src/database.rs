use std::fmt::{Display, Formatter};
use futures::stream::StreamExt;
use anyhow::Context as _;
use mongodb::bson::{doc, Document, to_document, oid::ObjectId};
use serde::de::DeserializeOwned;
use serde::Serialize;

#[derive(Clone, Debug)]
pub struct Database {
    pub db_handle: mongodb::Database,
}

unsafe impl Send for Database {}
unsafe impl Sync for Database {}

impl Database {
    pub fn new(db_handle: mongodb::Database) -> Self {
        Self { db_handle }
    }

    pub async fn find_all<T: DeserializeOwned + Send + Sync>(
        &self,
        collection_name: CollectionName,
        filter: Option<Document>,
    ) -> anyhow::Result<Vec<T>> {
        let collection = self.db_handle.collection::<T>(&collection_name.to_string());
        collection.find(filter.unwrap_or(doc! {})).await?
            .collect::<Vec<Result<_, _>>>().await
            .into_iter()
            .collect::<Result<Vec<_>, _>>()
            .context("Cannot find items!")
    }
    pub async fn find<T: DeserializeOwned + Send + Sync>(
        &self,
        collection_name: CollectionName,
        id: ObjectId,
    ) -> anyhow::Result<T> {
        let collection = self.db_handle.collection::<T>(&collection_name.to_string());
        collection.find_one(doc! { "_id": id })
            .await?.ok_or(anyhow::Error::msg("Cannot find item with id!"))
    }

    pub async fn create<T: Serialize + Send + Sync>(
        &self,
        collection_name: CollectionName,
        body: &T,
    ) -> anyhow::Result<()> {
        let collection = self.db_handle.collection::<T>(&collection_name.to_string());
        collection.insert_one(body).await?;
        Ok(())
    }

    pub async fn update<T: Serialize + Send + Sync>(
        &self,
        collection_name: CollectionName,
        id: ObjectId,
        body: T,
    ) -> anyhow::Result<()> {
        let collection = self.db_handle.collection::<T>(&collection_name.to_string());
        collection.update_one(
            doc! { "_id": id },
            doc! { "$set": to_document(&body)? }
        ).await?;
        Ok(())
    }

    pub async fn delete<T: DeserializeOwned + Send + Sync>(
        &self,
        collection_name: CollectionName,
        id: ObjectId,
    ) -> anyhow::Result<()> {
        let collection = self.db_handle.collection::<T>(&collection_name.to_string());
        collection.delete_one(doc! { "_id": id }).await?;
        Ok(())
    }
}

#[derive(Copy, Clone, Debug, Ord, PartialOrd, Eq, PartialEq, Hash)]
pub enum CollectionName {
    Tournament,
    Team,
    Player,
    Match,
    Game,
}
impl Display for CollectionName {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        let v = match self {
            Self::Tournament => "tournament",
            Self::Team => "team",
            Self::Player => "player",
            Self::Match => "match",
            Self::Game => "game",
        };
        write!(f, "{v}")
    }
}