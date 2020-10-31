const users = require("../models/users.js")();

module.exports = () => {
  const getController = async (req, res) => {
    res.json(await users.get());
  };

  const getByEmail = async (req, res) => {
    res.json(await users.get(req.params.email));
  };

  const postController = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const usertype = req.body.usertype;
    const key = req.body.key;
    const result = await users.add(name, email, usertype, key);
    res.json(result);
  };

  return {
    getController,
    postController,
    getByEmail,
  };
};
