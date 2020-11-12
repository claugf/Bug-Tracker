const uri = process.env.MONGO_URI;
const MongoClient = require("mongodb").MongoClient;
const DB_NAME = "bug-tracker";
const MONGO_OPTIONS = { useUnifiedTopology: true, useNewUrlParser: true };

module.exports = () => {
  const get = (collectionName, query = {}) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
        if (err) {
          console.log(err);
          return reject("====> get::MongoClient.connect");
        }

        const db = client.db(DB_NAME);
        const collection = db.collection(collectionName);
        collection.find(query).toArray((err, docs) => {
          if (err) {
            console.log(err);
            return reject("=======> get::collection.find");
          }

          resolve(docs);
          client.close();
        });
      });
    });
  };

  const add = (collectionName, item) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
        if (err) {
          console.log(err);
          return reject("====> add::MongoClient.connect");
        }

        const db = client.db(DB_NAME);
        const collection = db.collection(collectionName);

        collection.insertOne(item, (err, result) => {
          if (err) {
            console.log(err);
            return reject("========> add::collection.insertOne");
          }

          resolve(result);
          client.close();
        });
      });
    });
  };

  const count = (collectionName) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
        if (err) {
          console.log(err);
          return reject("====> count::MongoClient.connect");
        }

        const db = client.db(DB_NAME);
        const collection = db.collection(collectionName);

        collection.countDocuments({}, (err, docs) => {
          if (err) {
            console.log(err);
            return reject("========> count::collection.countDocuments");
          }

          resolve(docs);
          client.close();
        });
      });
    });
  };

  const aggregate = (collectionName, pipeline = []) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
        if (err) {
          console.log(err);
          return reject("====> aggregate::MongoClient.connect");
        }

        const db = client.db(DB_NAME);
        const collection = db.collection(collectionName);

        collection.aggregate(pipeline).toArray((err, docs) => {
          if (err) {
            console.log(err);
            return reject("========> aggregate::collection.aggregate");
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
        if (err) {
          console.log(err);
          return reject("====> update::MongoClient.connect");
        }

        const db = client.db(DB_NAME);
        const collection = db.collection(collectionName);

        collection.updateOne(pipeline, item, (err, result) => {
          if (err) {
            console.log(err);
            return reject("========> update::collection.updateOne");
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
