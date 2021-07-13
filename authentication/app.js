const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { SECRET } = require("../config/config");
const { initializePassport } = require("./passport-config");
const {
  getUsers,
  checkUserExists,
  createUser,
  getMessages,
} = require("../database/db-controller");
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

  const checkIsAuthenticated = (check) => {
    return (req, res, callback) => {
      if (check == true && req.isAuthenticated() == false) {
        return res.redirect("/login");
      }

      if (check == false && req.isAuthenticated() == true) {
        return res.redirect("/chat");
      }

      callback();
    };
  };

  app.use("/chat", checkIsAuthenticated(true), express.static("public"));

  app.get("/", checkIsAuthenticated(false), (req, res) => {
    res.render("login.ejs");
  });

  app.get("/login", checkIsAuthenticated(false), (req, res) => {
    res.render("login.ejs");
  });

  app.post(
    "/login",
    checkIsAuthenticated(false),
    passport.authenticate("local", {
      successRedirect: "/chat",
      failureRedirect: "/login",
      failureFlash: true,
    })
  );

  app.get("/register", checkIsAuthenticated(false), (req, res) => {
    res.render("register.ejs");
  });

  app.post("/register", checkIsAuthenticated(false), (req, res) => {
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
          user = {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
          };
          createUser(user);
          user.id = Date.now().toString(),
          users.push(user);
          res.redirect("/login");
        });
      }
    });
  });

  app.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/login");
  });

  app.get("/getUser", (req, res) => {
    res.send(req.user);
  });

  app.get("/getPersistedMessages", (req, res) => {
    getMessages(req.query.room).then((messages) => res.send(messages));
  });

  function checkPasswordAndHash(password) {
    return new Promise((resolve, reject) => {
      if (password.lenght > 20) {
        reject("password too long");
      }
      resolve(bcrypt.hash(password, 10));
    });
  }

  return app;
}
module.exports = {
  createApp,
};
