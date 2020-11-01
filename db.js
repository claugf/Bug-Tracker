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

  const count = (collectionName) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
        const db = client.db(DB_NAME);
        const collection = db.collection(collectionName);

        collection.countDocuments({}, (err, docs) => {
          resolve(docs);
          client.close();
        });
      });
    });
  };

  const aggregate = (collectionName, pipeline = []) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
        const db = client.db(DB_NAME);
        const collection = db.collection(collectionName);

        collection.aggregate(pipeline).toArray((err, docs) => {
          if (err) {
            console.log(" --- aggregate ERROR --- ");
            console.log(err);
          }

          resolve(docs);
          client.close();
        });
      });
    });
  };

  const update = (collectionName, pipeline, item) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
        const db = client.db(DB_NAME);
        const collection = db.collection(collectionName);

        collection.updateOne(pipeline, item, (err, result) => {
          if (err) {
            console.log(" --- update ERROR --- ");
            console.log(err);
          }
          resolve(result);
          client.close();
        });
      });
    });
  };

  return {
    get,
    add,
    count,
    aggregate,
    update,
  };
};
