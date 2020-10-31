const issues = require("../models/issues.js")();

module.exports = () => {
  const getController = async (req, res) => {
    res.json(await issues.get());
  };

  const getByIssueNumber = async (req, res) => {
    res.json(await issues.get(req.params.issueNumber));
  };

  const postController = async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const status = "open";
    //console.log(req.params);
    const slug = req.params.slug;
    const result = await issues.add(title, description, status, slug);
    res.json(result);
  };

  const populatedController = async (req, res) => {
    const slug = req.params.slug;
    res.json(await issues.aggregateWithProjects(slug));
  };

  return {
    getController,
    postController,
    getByIssueNumber,
    populatedController,
  };
};
