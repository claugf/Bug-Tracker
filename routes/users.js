const express = require("express");
const { route } = require(".");
const router = express.Router();
const passport = require("passport");

//  Setting controllers
const usersController = require("../controllers/users")();

//  Login Page
router.get("/login", (req, res) => res.render("login"));

//  Register Page
router.get("/register", (req, res) => res.render("register"));

//  Register Handler
router.post("/register", async (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  //  Check password match
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (errors.length > 0) {
    //  Rerender same page, with the data that the user already filled up
    res.render("register", { errors, name, email, password, password2 });
  } else {
    //  Validation passed
    console.log(req.body);
    try {
      const { usersResult, error } = await usersController.postControllerbyView(
        req,
        res
      );
      if (error) {
        console.log(error);
        errors.push({ msg: error });
        //  Rerender same page, with the data that the user already filled up
        res.render("register", { errors, name, email, password, password2 });
      } else {
        //    Send success message
        req.flash(
          "success_msg",
          "You have been registered sucessfully, please Log In!"
        );
        //    Redirect to login page
        res.redirect("/users/login");
      }
    } catch (err) {
      console.log(err);
    }
  }
});

//  Login Handler
router.post("/login", async (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

//  Logout Handler
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out!");
  res.redirect("/users/login");
});

module.exports = router;
