const projects = require("../models/projects.js")();

module.exports = () => {
  const getController = async (req, res) => {
    const { projectsResult, error } = await projects.get();
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ projects: projectsResult });
  };

  const getBySlug = async (req, res) => {
    const { projectsResult, error } = await projects.get(req.params.slug);
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ projects: projectsResult });
  };

  const postController = async (req, res) => {
    const slug = req.body.slug;
    const name = req.body.name;
    const description = req.body.description;
    const { projectsResult, error } = await projects.add(
      slug,
      name,
      description
    );
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ projects: projectsResult });
  };

  return {
    getController,
    postController,
    getBySlug,
  };
};
