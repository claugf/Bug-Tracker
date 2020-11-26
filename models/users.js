const db = require("../db.js")();
const COLLECTION = "users"; //  For DB
const bcrypt = require("bcrypt"); //  Library for hashing password
const { use } = require("passport");
//const { use } = require("../index.js");
const saltRounds = 10;

module.exports = () => {
  const get = async (email = null) => {
    // In case name is null, all users are given
    if (!email) {
      try {
        const users = await db.get(COLLECTION);
        return { usersResult: users };
      } catch (ex) {
        console.log("-=-=-=-= Users Get Error");
        return { error: ex };
      }
    }

    //  In case name is set, we pass it by param
    try {
      const user = await db.get(COLLECTION, { email });
      return { usersResult: user };
    } catch (ex) {
      console.log("-=-=-=-= User Get Error");
      return { error: ex };
    }
  };

  const verifyngHashKey = async (key) => {
    //  Asking for the key
    if (!key) {
      console.log(" 01: Missing key");
      return null;
    }
    //  Getting all users, as we are not passing the userID/name for the moment
    let users;
    try {
      users = await db.get(COLLECTION);
    } catch (ex) {
      console.log("-=-=-=-= Users verifyngHashKey Error");
      return { error: ex };
    }
    //  Going through users array to compare if there is a user with that key
    try {
      const a = await bcrypt.compare(key, users[0].key).then((result) => {
        return result;
      });

      return { isValid: a };
    } catch (ex) {
      console.log("-=-=-=-= Users bcrypt Error");
      return { error: ex };
    }
  };

  const verifyngUser = async (email, key) => {
    //  Getting user, by email
    let user;
    try {
      user = await get(email);
      //  If the user is found
      if (user.usersResult.length > 0) {
        //  Compare if the user key is the same that is provided
        try {
          const a = await bcrypt
            .compare(key, user.usersResult[0].key)
            .then((result) => {
              return result;
            });
          return { isValid: a };
        } catch (ex) {
          console.log("-=-=-=-= Users bcrypt Error");
          return { error: ex };
        }
      } else {
        //  If the user is not found
        return { error: "The email is not registered in the database" };
      }
    } catch (ex) {
      console.log("-=-=-=-= Users verifyngUser Error");
      return { error: ex };
    }
  };

  const add = async (name, email, usertype, key) => {
    //  Ask for all the paramereters before add it
    if (name != null && email != null && usertype != null && key != null) {
      //  Getting users by email
      let users;
      try {
        users = await get(email);
      } catch (ex) {
        console.log("-=-=-=-= Users Add/Get Error");
        return { error: ex };
      }

      //  Checking if the user already exists
      if (users.usersResult.length === 0) {
        try {
          let results = null;
          //  Hashing password
          await bcrypt.hash(key, saltRounds).then(async (hash) => {
            try {
              console.log(hash);
              //  Saving user with hashed password
              results = await db.add(COLLECTION, {
                name: name,
                email: email,
                usertype: usertype,
                key: hash,
              });
            } catch (ex) {
              console.log("-=-=-=-= User Add Error");
              return { error: ex };
            }
          });
          return { usersResult: results.result };
        } catch (ex) {
          console.log("-=-=-=-= User Add/Bcrypt Error");
          return { error: ex };
        }
      } else {
        //  If we reach this point is because the user already exists
        return { error: "This user already exists in the database!" };
      }
    } else {
      return {
        error: "Please fill out all required fields to add the user!",
      };
    }
  };

  return {
    get,
    add,
    verifyngHashKey,
    verifyngUser,
  };
};
