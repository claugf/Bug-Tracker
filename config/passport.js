const { use } = require("passport");

const LocalStrategy = require("passport-local").Strategy;

//  Setting models for security
const users = require("../models/users")();

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        //    Verifying key
        const { isValid, error } = await users.verifyngUser(email, password);
        if (!isValid) {
          if (error) {
            return done(null, false, { message: error });
          } else {
            return done(null, false, { message: "Password Incorrect!" });
          }
        } else {
          // Valid user and password
          return done(null, email);
        }
      }
    )
  );
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(async (email, done) => {
    //    Verifying Id, and taking the user's name
    const { usersResult, error } = await users.get(email);
    done(error, usersResult[0].name);
  });
};
