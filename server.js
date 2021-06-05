const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const express = require("express");
const { auth } = require("express-openid-connect");
const { requiresAuth } = require("express-openid-connect");
const { consumeMessage, publishMessage } = require("./amqp");
const activeUsers = new Set();

const {
  SERVER_PORT,
  ISSUER_BASE_URL,
  CLIENT_ID,
  BASE_URL,
  SECRET,
} = require("./config");

app.use(
  auth({
    issuerBaseURL: ISSUER_BASE_URL,
    baseURL: BASE_URL,
    clientID: CLIENT_ID,
    secret: SECRET,
    idpLogout: true,
  })
);

app.use('/', express.static('public'));

app.get("/profile", requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
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
    io.emit("user disconnected", socket.userId);
  });
});


http.listen(SERVER_PORT, () => {
  console.log("Server is running on Port: " + SERVER_PORT);
});

function emitMessage(payload){
  io.emit("message", payload.user + ": " + payload.message)
}

consumeMessage(emitMessage);

module.exports = {
  app, io
};
