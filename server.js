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
const bcrypt = require("bcrypt");
const users = [];
const { SERVER_PORT, SECRET } = require("./config");

initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);
http.listen(SERVER_PORT, () => {
  console.log("Server is running on Port: " + SERVER_PORT);
});

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
  console.log(users);
});

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("login");
});

app.get("/getUser", (req, res) => {
  res.send(req.user);
});

io.on("connection", (socket) => {
  socket.on("joinRoom", (data) => {
    socket.join(data.room);
  });

  socket.on("message", (message) => {
    publishMessage(message);
    console.log("Message: " + JSON.stringify(message));
  });

  socket.on("newUser", (data) => {
    let isNewUser = true;
    const user = {
      user: data.user,
      room: data.room,
    };
    socket.userId = user.user;

    activeUsers.forEach((user) => {
      if (user.user == socket.userId) {
        isNewUser = false;
        return;
      }
    });

    if (isNewUser == true) {
      activeUsers.add(user);

      io.to(data.room).emit("newUser", user);
    }

    emitUsers(data.room);
  });

  socket.on("disconnect", () => {
    let room = "";
    
    activeUsers.forEach((user) => {
      if (user.user == socket.userId) {
        room = user.room;
        activeUsers.delete(user);

        io.to(room).emit("removeUser", socket.userId);
      }

      emitUsers(room);
    });
  });
});

function emitUsers(room) {
  io.to(room).emit("roomUsers", {
    room: room,
    users: JSON.stringify(Array.from(activeUsers)),
  });
}

function emitMessage(payload) {
  io.to(payload.room).emit("message", payload.user + ": " + payload.message);
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

consumeMessage(emitMessage);

module.exports = {
  app,
};
