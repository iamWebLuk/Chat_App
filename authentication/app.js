const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { SECRET } = require("../config");
const { initializePassport } = require("./passport-config");
const { getUsers, getUser, createUser } = require("../database/db-controller");
const users = [];

function createApp(app) {
  getUsers()
    .then((usersInDatabase) => {
      usersInDatabase.forEach((element) => {
        users.push({
          id: element.id,
          name: element.name,
          email: element.email,
          password: element.password,
        });
      });
      return users;
    })
    .then(() => {
      initializePassport(
        passport,
        (email) => users.find((user) => user.email === email),
        (id) => users.find((user) => user.id === id)
      );
    })
    .catch((err) => reject(err));

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

  app.use("/chat", checkIsAuthenticated, express.static("public"));

  app.get("/", (req, res) => {
    res.render("login.ejs");
  });

  app.get("/login", checkIsNotAuthenticated, (req, res) => {
    res.render("login.ejs");
  });

  app.post(
    "/login",
    checkIsNotAuthenticated,
    passport.authenticate("local", {
      successRedirect: "/chat",
      failureRedirect: "/login",
      failureFlash: true,
    })
  );

  app.get("/register", checkIsNotAuthenticated, (req, res) => {
    res.render("register.ejs");
  });

  app.post("/register", checkIsNotAuthenticated, async (req, res) => {
   
      const userAlreadyExists = new Promise((resolve, reject) => {
        getUser(req.body.name, req.body.email)
          .then((userExists) => {
            console.log("User or email already existent: " + userExists);
            return userExists;
          })
          .then((userExists) => {
            if (userExists) {
              resolve(true);
            }
          })
          .then(() => resolve(false))
          .catch((err) => reject(err));
      });

      try {
        if (userAlreadyExists){
          throw new Error("User already exists")
        }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      createUser({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });

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

  function checkIsAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    res.redirect("/login");
  }

  function checkIsNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect("/");
    }
    next();
  }
}

module.exports = {
  createApp,
};
