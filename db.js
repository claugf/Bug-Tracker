const uri = process.env.MONGO_URI;
const MongoClient = require("mongodb").MongoClient;
const DB_NAME = "bug-tracker";
const MONGO_OPTIONS = { useUnifiedTopology: true, useNewUrlParser: true };

module.exports = () => {
  const get = (collectionName, query = {}) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
        const db = client.db(DB_NAME);
        const collection = db.collection(collectionName);
        collection.find(query).toArray((err, docs) => {
          resolve(docs);
          client.close();
        });
      });
    });
  };

  const add = (collectionName, item) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
        const db = client.db(DB_NAME);
        const collection = db.collection(collectionName);

        collection.insertOne(item, (err, result) => {
          resolve(result);
          client.close();
        });
      });
    });
  };
  const authors = [
    { id: 1, name: "William Gibson" },
    { id: 2, name: "Neil Stephenson" },
  ];

  return {
    authors,
    get,
    add,
  };
};
