const express = require("express");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const nodemailer = require("nodemailer");
const path = require("path");
const passport = require("passport");

const hostname = "0.0.0.0";
const port = process.env.PORT || 3000;

//  Setting models for security
const users = require("./models/users")();
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

app.post("/CORREO", (req, res) => {
  const email = `
  <p>You have a new email from your app love</p>
  <h2>We did it</h2>
  <p>${req.body.username}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "claudia.cbwa@gmail.com",
      pass: "CBWA2020",
    },
  });

  const mailOptions = {
    from: "claudia.cbwa@gmail.com", // sender address
    to: "claudiagf_7@hotmail.com", // list of receivers
    subject: "test mail", // Subject line
    html: email, //'<h1>this is a test mail.</h1>'// plain text body
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  });

  // console.log(req.body);
});

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
//  Get an issue by issueNumber
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
