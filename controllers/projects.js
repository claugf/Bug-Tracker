const projects = require("../models/projects.js")();

module.exports = () => {
  const getController = (req, res) => {
    res.setHeader("Content-Type", "application/json");
    return res.json(projects.get());
  };

  const getById = (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.json(projects.get(req.params.slug));
  };

  const postController = (req, res) => {
    const slug = req.body.slug;
    const name = req.body.name;
    const description = req.body.description;
    projects.add(slug, name, description);
    return res.end(`POST: ${slug}`);
  };

  return {
    getController,
    postController,
    getById,
  };
};
