const issues = require("../models/issues.js")();

module.exports = () => {
  const getController = async (req, res) => {
    res.json(await issues.get());
  };

  const getByNumber = async (req, res) => {
    res.json(await issues.get(req.params.number));
  };

  const postController = async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const status = req.body.status;
    const slug = req.body.slug;
    const result = await issues.add(title, description, status, slug);
    res.json(result);
  };

  return {
    getController,
    postController,
    getByNumber,
  };
};
