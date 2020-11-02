const db = require("../db.js")();
const COLLECTION = "users"; //  For DB
const bcrypt = require("bcrypt"); //  Library for hashing password
const { use } = require("../index.js");
const saltRounds = 10;

module.exports = () => {
  const get = async (email = null) => {
    console.log("   inside users model");
    // In case name is null, all users are given
    if (!email) {
      const users = await db.get(COLLECTION);
      return users;
    }

    //  In case name is set, we pass it by param
    const user = await db.get(COLLECTION, { email });
    return user;
  };

  const verifyngHashKey = async (key) => {
    //  Asking for the key
    if (!key) {
      console.log(" 01: Missing key");
      return null;
    }
    //  Getting all users, as we are not passing the userID/name for the moment
    const users = await db.get(COLLECTION);
    //  Going through users array to compare if there is a user with that key
    const a = await bcrypt.compare(key, users[0].key).then((result) => {
      return result;
    });

    return { isValid: a };
  };

  const add = async (name, email, usertype, key) => {
    //  Hashing password
    bcrypt.hash(key, saltRounds).then((hash) => {
      console.log(hash);
      //  Saving user with hashed password
      const results = db.add(COLLECTION, {
        name: name,
        email: email,
        usertype: usertype,
        key: hash,
      });
      return results.result;
    });
  };

  return {
    get,
    add,
    verifyngHashKey,
  };
};
