const users = require("../models/users.js")();

module.exports = () => {
  const getController = async (req, res) => {
    const { usersResult, error } = await users.get();
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ users: usersResult });
  };

  const getByEmail = async (req, res) => {
    const { usersResult, error } = await users.get(req.params.email);
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ users: usersResult });
  };

  const postController = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const usertype = req.body.usertype;
    const key = req.body.key;
    const { usersResult, error } = await users.add(name, email, usertype, key);
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ users: usersResult });
  };
  const postControllerbyView = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    //  It sets "user" as default usertype when the user is registered by the user' view
    const usertype = "user";
    const key = req.body.password;
    const { usersResult, error } = await users.add(name, email, usertype, key);
    if (error) {
      return { error };
    } else {
      return { usersResult };
    }
  };

  return {
    getController,
    getByEmail,
    postController,
    postControllerbyView,
  };
};
