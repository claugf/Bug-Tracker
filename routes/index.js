const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const projectsController = require("../controllers/projects")();

//  Welcome Page
router.get("/", (req, res) => res.render("welcome"));

//  Dashboard
router.get("/dashboard", ensureAuthenticated, async (req, res) => {
  //  Getting all the projects to show them in te dashboard
  const { projectsResult, error } = await projectsController.getProjectsbyView(
    req,
    res
  );
  res.render("dashboard", { user: req.user, projects: projectsResult });
});

module.exports = router;
