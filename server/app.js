const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const express = require("express");
const bcrypt = require("bcrypt");
const initializePassport = require("./passport-config");
const passport = require("passport");
const { SECRET } = require("../config");
var regex = "^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$";
const users = [];

function createApp(app) {
  initializePassport(
    passport,
    (email) => users.find((user) => user.email === email),
    (id) => users.find((user) => user.id === id)
  );

  app.set("view-engine", "ejs");
  app.use(express.urlencoded({ extended: false }));
  app.use(flash());
  app.use(
    session({
      secret: SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(methodOverride("_method"));

  app.use("/chat", checkAuthenticated, express.static("public"));

  app.get("/", (req, res) => {
    res.render("login.ejs");
  });

  app.get("/login", checkNotAuthentication, (req, res) => {
    res.render("login.ejs");
  });

  app.post(
    "/login",
    checkNotAuthentication,
    passport.authenticate("local", {
      successRedirect: "/chat",
      failureRedirect: "/login",
      failureFlash: true,
    })
  );

  app.get("/register", checkNotAuthentication, (req, res) => {
    res.render("register.ejs");
  });

  app.post("/register", checkNotAuthentication, async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });
      res.redirect("/login");
    } catch {
      res.redirect("/register");
    }
  });

  app.delete("/logout", (req, res) => {
    req.logOut();
    res.redirect("login");
  });

  app.get("/getUser", (req, res) => {
    res.send(req.user);
  });

  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  }

  function checkNotAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect("/");
    }
    next();
  }
}
module.exports = {
    createApp,
  };
  
