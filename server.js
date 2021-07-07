const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const express = require("express");
const { consumeMessage, publishMessage } = require("./amqp");
const methodOverride = require("method-override");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const activeUsers = new Set();

var regex = "^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$";

const initializePassport = require("./passport-config");
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

const bcrypt = require("bcrypt");
const users = [];

const {
  SERVER_PORT,
  ISSUER_BASE_URL,
  CLIENT_ID,
  BASE_URL,
  SECRET,
} = require("./config");


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

app.get("/", checkAuthenticated, (req, res) => {
  res.sendFile(__dirname + "/public/");
});

app.get("/login", checkNotAuthentication, (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  checkNotAuthentication,
  passport.authenticate("local", {
    successRedirect: "/",
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
  console.log(users);
});

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("login");
});


io.on("connection", (socket) => {
  socket.on("message", (message) => {
    publishMessage(message);
    console.log("Message: " + JSON.stringify(message));
  });

  socket.on("new user", (data) => {
    const user = JSON.stringify(data);
    socket.userId = user;
    if (!activeUsers.has(user)) {
      activeUsers.add(user);
      io.emit("new user", "New User connected: " + user);
    }
  });

  socket.on("disconnect", () => {
    activeUsers.delete(socket.userId);
    io.emit("message", "User disconnected: " + socket.userId);
  });
});

http.listen(SERVER_PORT, () => {
  console.log("Server is running on Port: " + SERVER_PORT);
});

function emitMessage(payload) {
  io.emit("message", payload.user + ": " + payload.message);
}

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


app.get("/getUser", (req, res) => {
  res.send(req.user)
  console.log(req.user)

});

consumeMessage(emitMessage);

module.exports = {
  app,
};
