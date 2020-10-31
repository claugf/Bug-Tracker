const db = require("../db.js")();
const COLLECTION = "users";

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

  const add = async (name, email, usertype, key) => {
    const results = await db.add(COLLECTION, {
      name: name,
      email: email,
      usertype: usertype,
      key: key,
    });
    return results.result;
  };

  return {
    get,
    add,
  };
};
