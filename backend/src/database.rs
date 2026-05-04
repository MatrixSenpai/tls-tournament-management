use anyhow::Context as _;
use futures::stream::StreamExt;
use mongodb::bson::{doc, Document, to_document, oid::ObjectId};
use serde::Serialize;
use schema::database::CollectionType;

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

    pub async fn find_all<T: CollectionType>(&self, filter: Option<Document>) -> anyhow::Result<Vec<T>> {
        let collection = self.db_handle.collection(T::collection_name());
        collection.find(filter.unwrap_or(doc! {})).await?
            .collect::<Vec<Result<_, _>>>().await
            .into_iter()
            .collect::<Result<Vec<_>, _>>()
            .context("Cannot find items!")
    }
    pub async fn find<T: CollectionType>(&self, id: ObjectId) -> anyhow::Result<T> {
        let collection = self.db_handle.collection(T::collection_name());
        collection.find_one(doc! { "_id": id })
            .await?.ok_or(anyhow::Error::msg("Cannot find item with id!"))
    }

    pub async fn create<T: CollectionType>(&self, body: &T) -> anyhow::Result<()> {
        let collection = self.db_handle.collection::<T>(T::collection_name());
        collection.insert_one(body).await?;
        Ok(())
    }

    pub async fn update<T: CollectionType>(&self, id: ObjectId, body: &T) -> anyhow::Result<()> {
        let collection = self.db_handle.collection::<T>(T::collection_name());
        collection.update_one(
            doc! { "_id": id },
            doc! { "$set": to_document(body)? }
        ).await?;
        Ok(())
    }

    pub async fn delete<T: CollectionType>(&self, id: ObjectId) -> anyhow::Result<()> {
        let collection = self.db_handle.collection::<T>(T::collection_name());
        collection.delete_one(doc! { "_id": id }).await?;
        Ok(())
    }
}

