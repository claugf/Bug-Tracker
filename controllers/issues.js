const issues = require("../models/issues.js")();

module.exports = () => {
  const getController = async (req, res) => {
    const { issuesResult, error } = await issues.get();
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ issues: issuesResult });
  };

  const getByIssueNumber = async (req, res) => {
    const { issuesResult, error } = await issues.get(req.params.issueNumber);
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ issues: issuesResult });
  };

  const postController = async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const status = "open";
    const slug = req.params.slug;
    const { issuesResult, error } = await issues.add(
      title,
      description,
      status,
      slug
    );
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ issues: issuesResult });
  };

  const populatedController = async (req, res) => {
    //const slug = req.params.slug;
    const { issuesResult, error } = await issues.aggregateWithProjects(
      req.params.slug
    );
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ issues: issuesResult });
  };

  const getCommentsByIssues = async (req, res) => {
    const { issuesResult, error } = await issues.getCommentsByIssue();
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ issues: issuesResult });
  };

  const getCommentsByIssue = async (req, res) => {
    const { issuesResult, error } = await issues.getCommentsByIssue(
      req.params.issueNumber
    );
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ issues: issuesResult });
  };

  const getAComment = async (req, res) => {
    const issueNumber = req.params.issueNumber;
    const index = req.params.index;
    const { issuesResult, error } = await issues.getAComment(
      issueNumber,
      index
    );
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ issues: issuesResult });
  };

  const postAddComment = async (req, res) => {
    const issueNumber = req.params.issueNumber;
    const text = req.body.text;
    const author = req.body.author;
    const { issuesResult, error } = await issues.addComment(
      issueNumber,
      text,
      author
    );
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ issues: issuesResult });
  };

  const postAddWatcher = async (req, res) => {
    const issueNumber = req.params.issueNumber;
    const watcher = req.params.watcher;
    const { issuesResult, error } = await issues.addWatcher(
      issueNumber,
      watcher
    );
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ issues: issuesResult });
  };

  const updateStatus = async (req, res) => {
    const issueNumber = req.params.issueNumber;
    const status = req.params.status;
    const { issuesResult, error } = await issues.updateStatus(
      issueNumber,
      status
    );
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ issues: issuesResult });
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
    postAddWatcher,
    updateStatus,
  };
};
