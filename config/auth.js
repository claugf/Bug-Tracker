const users = require("../models/users")();

module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Please log in first!");
    res.redirect("/users/login");
  },
  postmanAuthentication: async (req, res, next) => {
    const FailedAuthMessage = {
      error: "Failed Authentication",
      message: "Go away!",
      code: "xxx", // Some useful error code
    };

    const suppliedKey = req.headers["x-api-key"];
    const clientIp =
      req.headers["x-forwarder-for"] || req.connection.remoteAddress;
    //  Check Pre-shared key
    if (!suppliedKey) {
      console.log(
        " [%s] FAILED AUTHENTICATION -- %s, No Key Supplied",
        new Date(),
        clientIp
      );
      FailedAuthMessage.code = "01";
      return res.status(401).json(FailedAuthMessage);
    }

    const validKey = await users.verifyngHashKey(suppliedKey);
    if (!validKey.isValid) {
      console.log(
        " [%s] FAILED AUTHENTICATION -- %s, Bad Key Supplied",
        new Date(),
        clientIp
      );
      FailedAuthMessage.code = "02";
      return res.status(401).json(FailedAuthMessage);
    }
    next();
  },
};
