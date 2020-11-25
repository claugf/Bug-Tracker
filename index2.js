const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const nodemailer = require("nodemailer");
const path = require("path");

const hostname = "0.0.0.0";
const port = process.env.PORT || 3000;

//  Setting models for security
const users = require("./models/users")();

//  Setting controllers
const projectsController = require("./controllers/projects")();
const usersController = require("./controllers/users")();
const issuesController = require("./controllers/issues")();

const app = (module.exports = express());

//  Logging
app.use((req, res, next) => {
  //Display log for requests
  console.log("[%s] %s -- %s", new Date(), req.method, req.url);
  next();
});

//  Adding body-parser instance as a middleware handler
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//  Implementing security
app.use(async (req, res, next) => {
  return next();
  const FailedAuthMessage = {
    error: "Failed Authentication",
    message: "Go away!",
    code: "xxx", // Some useful error code
  };

  const suppliedKey = req.headers["x-api-key"];
  const clientIp =
    req.headers["x-forwarder-for"] || req.connection.remoteAddress;
  //  Check Pre-shared key
  if (!suppliedKey) {
    console.log(
      " [%s] FAILED AUTHENTICATION -- %s, No Key Supplied",
      new Date(),
      clientIp
    );
    FailedAuthMessage.code = "01";
    return res.status(401).json(FailedAuthMessage);
  }

  const validKey = await users.verifyngHashKey(suppliedKey);
  if (!validKey.isValid) {
    console.log(
      " [%s] FAILED AUTHENTICATION -- %s, Bad Key Supplied",
      new Date(),
      clientIp
    );
    FailedAuthMessage.code = "02";
    return res.status(401).json(FailedAuthMessage);
  }
  next();
});

//  View engine setup
// app.set("views", path.join(__dirname, "views"));
app.engine("hbs", exphbs());
app.set("view engine", "hbs");

//  Static folder
app.use("/public", express.static(path.join(__dirname, "public")));

//  Setting root route
app.get("/", async (req, res) => {
  //  Redirect to index.hbs
  res.render("index", { layout: false });

  // res.json({
  //   CBWA: "CA2",
  //   studentName: "Claudia Gonzalez",
  //   studentId: "2020085",
  // });
});

app.post("/login", async (req, res, next) => {
  // const FailedAuthMessage = {
  //   error: "Failed Authentication",
  //   message: "Go away!",
  //   code: "xxx", // Some useful error code
  // };

  const username = req.body.username;
  const password = req.body.password;
  const clientIp =
    req.headers["x-forwarder-for"] || req.connection.remoteAddress;
  //  Check Pre-shared key
  if (!suppliedKey) {
    console.log(
      " [%s] FAILED AUTHENTICATION -- %s, No Key Supplied",
      new Date(),
      clientIp
    );
    FailedAuthMessage.code = "01";
    return res.status(401).json(FailedAuthMessage);
  }

  // const validKey = await users.verifyngHashKey(suppliedKey);
  // if (!validKey.isValid) {
  //   console.log(
  //     " [%s] FAILED AUTHENTICATION -- %s, Bad Key Supplied",
  //     new Date(),
  //     clientIp
  //   );
  //   FailedAuthMessage.code = "02";
  //   return res.status(401).json(FailedAuthMessage);
  // }
  console.log(req.body);
  next();
});

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
//  Update status
app.put(
  "/projects/:slug/issues/:issueNumber/:status",
  issuesController.updateStatus
);

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
