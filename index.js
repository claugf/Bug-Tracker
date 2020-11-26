const express = require("express");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const path = require("path");
const passport = require("passport");

const hostname = "0.0.0.0";
const port = process.env.PORT || 3000;

//  Setting models for security by Postman
const { postmanAuthentication } = require("./config/auth");

//  Setting controllers
const projectsController = require("./controllers/projects")();
const usersController = require("./controllers/users")();
const issuesController = require("./controllers/issues")();

const app = (module.exports = express());

//  Passport config
require("./config/passport")(passport);
//  ----------------------  DISCLAIMER  ----------------------
//  All related to authentication(login/register) was inspired/guided by this video:
//  https://www.youtube.com/watch?v=6FOq4cUdH8k
//  However, the code was used according our needs

//  Logging
app.use((req, res, next) => {
  //Display log for requests
  console.log("[%s] %s -- %s", new Date(), req.method, req.url);
  next();
});

//  EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//  Adding body-parser instance as a middleware handler
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//  Express Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//  Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

//  Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//  Static folder
app.use("/public", express.static(path.join(__dirname, "public")));

//  Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

//  Get all projects
app.get("/projects", postmanAuthentication, projectsController.getController);
//  Add a project
app.post("/projects", postmanAuthentication, projectsController.postController);
//  Get a project by slug
app.get("/projects/:slug", postmanAuthentication, projectsController.getBySlug);

//  Get all users
app.get("/users", postmanAuthentication, usersController.getController);
//  Add an user
app.post("/users", postmanAuthentication, usersController.postController);
//  Get an user by Email
app.get("/users/:email", postmanAuthentication, usersController.getByEmail);

//  Get all issues
app.get("/issues", postmanAuthentication, issuesController.getController);
//  Add an issue
app.post(
  "/projects/:slug/issues",
  postmanAuthentication,
  issuesController.postController
);
//  Get an issue by issueNumber123
app.get(
  "/issues/:issueNumber",
  postmanAuthentication,
  issuesController.getByIssueNumber
);
//  Get all issues for a project
app.get(
  "/projects/:slug/issues",
  postmanAuthentication,
  issuesController.populatedController
);
//  Update status
app.put(
  "/projects/:slug/issues/:issueNumber/:status",
  postmanAuthentication,
  issuesController.updateStatus
);

//  Get all comments
app.get(
  "/comments",
  postmanAuthentication,
  issuesController.getCommentsByIssues
);
//  Get all comments by issueNumber
app.get(
  "/issues/:issueNumber/comments",
  postmanAuthentication,
  issuesController.getCommentsByIssue
);
//  Get a comment by issueNumber and index
app.get(
  "/issues/:issueNumber/comments/:index",
  postmanAuthentication,
  issuesController.getAComment
);
//  Add a comment by issueNumber
app.post(
  "/issues/:issueNumber/comments",
  postmanAuthentication,
  issuesController.postAddComment
);

//  Add a watcher by issueNumber
app.post(
  "/issues/:issueNumber/watcher/:watcher",
  postmanAuthentication,
  issuesController.postAddWatcher
);

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
