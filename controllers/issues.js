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
    const slug = req.params.slug;
    const result = await issues.add(title, description, status, slug);
    res.json(result);
  };

  const populatedController = async (req, res) => {
    const slug = req.params.slug;
    res.json(await issues.aggregateWithProjects(slug));
  };

  const getCommentsByIssues = async (req, res) => {
    res.json(await issues.getCommentsByIssue());
  };

  const getCommentsByIssue = async (req, res) => {
    res.json(await issues.getCommentsByIssue(req.params.issueNumber));
  };

  const getAComment = async (req, res) => {
    const issueNumber = req.params.issueNumber;
    const index = req.params.index;
    res.json(await issues.getAComment(issueNumber, index));
  };

  const postAddComment = async (req, res) => {
    const issueNumber = req.params.issueNumber;
    const text = req.body.text;
    const author = req.body.author;
    const result = await issues.addComment(issueNumber, text, author);
    res.json(result);
  };

  const updateStatus = async (req, res) => {
    const issueNumber = req.params.issueNumber;
    const status = req.params.status;
    const result = await issues.updateStatus(issueNumber, status);
    res.json(result);
  };

  return {
    getController,
    postController,
    getByIssueNumber,
    populatedController,
    getCommentsByIssues,
    getCommentsByIssue,
    getAComment,
    postAddComment,
    updateStatus,
  };
};
