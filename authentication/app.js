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
let firstLoad = false;

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
    if (checkFirstLoad(res) == false) {
      res.render("login.ejs");
    }
  });

  app.get("/login", checkIsNotAuthenticated, (req, res) => {
    if (checkFirstLoad(res) == false) {
      res.render("login.ejs");
    }
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

  app.post("/register", checkIsNotAuthenticated, (req, res) => {
    const userAlreadyExists = new Promise((resolve, reject) => {
      checkUserExists(req.body.name, req.body.email)
        .then((userExists) => {
          console.log("User or email already existent: " + userExists);
          if (userExists == true) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((err) => reject(err));
    });

    userAlreadyExists.then((userAlreadyExists) => {
      if (userAlreadyExists == true) {
        res.redirect("/register");
      } else {
        checkPasswordAndHash(req.body.password).then((hashedPassword) => {
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
        });
      }
    });
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

  function checkPasswordAndHash(password) {
    return new Promise((resolve, reject) => {
      if (password.lenght > 20) {
        reject("password too long");
      }
      resolve(bcrypt.hash(password, 10));
    });
  }

  function checkFirstLoad(res) {
    //This is very bad, only temporary fix because there is an Error: Unknown authentication strategy "local" when the login happens too fast after the server starts
    //I think this is because passport is loaded before users are fetched from the db
    if (firstLoad == true) {
      firstLoad = false;
      setTimeout(() => res.render("login.ejs"), 10000);
    } else {
      return false;
    }
  }
}
module.exports = {
  createApp,
};
