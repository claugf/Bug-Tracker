const express = require("express");
const bodyParser = require("body-parser");

const hostname = "0.0.0.0";
const port = process.env.PORT || 3000;

//  Setting controllers
const projectsController = require("./controllers/projects")();
const usersController = require("./controllers/users")();
const issuesController = require("./controllers/issues")();

const app = (module.exports = express());

//logging
app.use((req, res, next) => {
  //Display log for requests
  console.log("[%s] %s -- %s", new Date(), req.method, req.url);
  next();
});

//adding body-parser instance as a middleware handler
app.use(bodyParser.json());

//  Implementing security
app.use(async (req, res, next) => {
  const FailedAuthMessage = {
    error: "Failed Authentication",
    message: "Go away!",
    code: "xxx", // Some useful error code
  };

  const suppliedKey = req.headers["x-api-key"];
  const mykey = "CBWA - CA1 - CLAUDIA";
  const clientIp =
    req.headers["x-forwarder-for"] || req.connection.remoteAddress;

  //  Check Pre-shared key
  if (suppliedKey !== mykey) {
    console.log(
      " [%s] FAILED AUTHENTICATION -- %s, No Key Supplied",
      new Date(),
      clientIp
    );
    FailedAuthMessage.code = "01";
    return res.status(401).json(FailedAuthMessage);
  }

  next();
});

//  Setting root route
app.get("/", (req, res) => {
  res.json({
    CBWA: "CA1",
    studentName: "Claudia Gonzalez",
    studentId: "2020085",
  });
});

//  Get all projects
app.get("/projects", projectsController.getController);
//  Add a project
app.post("/projects", projectsController.postController);
//  Get a project by slug
app.get("/projects/:slug", projectsController.getBySlug);

//  Get all users
app.get("/users", usersController.getController);
//  Add an user
app.post("/users", usersController.postController);
//  Get an user by Email
app.get("/users/:email", usersController.getByEmail);

//  Get all issues
app.get("/issues", issuesController.getController);
//  Add an issue
app.post("/projects/:slug/issues", issuesController.postController);
//  Get an issue by issueNumber
app.get("/issues/:issueNumber", issuesController.getByIssueNumber);
//  Get all issues for a project
app.get("/projects/:slug/issues", issuesController.populatedController);

//  Get all comments
app.get("/comments", issuesController.getCommentsByIssues);
//  Get all comments by issueNumber
app.get("/issues/:issueNumber/comments", issuesController.getCommentsByIssue);
//  Get a comment by issueNumber and index
app.get("/issues/:issueNumber/comments/:index", issuesController.getAComment);
//  Add a comment by issueNumber
app.post("/issues/:issueNumber/comments", issuesController.postAddComment);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

//404 response
app.use((req, res) => {
  res.status(404).json({
    error: 404,
    message: "Route not found",
  });
});
