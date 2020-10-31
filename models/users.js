const { use } = require("../index.js");

const db = require("../db.js")();
const COLLECTION = "users";

module.exports = () => {
  const get = async (name = null) => {
    console.log("   inside users model");
    // In case slug is null, all projects are given
    if (!name) {
      const users = await db.get(COLLECTION);
      return users;
    }

    //  In case slug is set, we pass by param
    const user = await db.get(COLLECTION, { name });
    return user;
  };

  const add = async (name, email, usertype) => {
    const results = await db.add(COLLECTION, {
      name: name,
      email: email,
      usertype: usertype,
    });
    return results.result;
  };

  return {
    get,
    add,
  };
};
