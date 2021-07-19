const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const { SERVER_PORT } = require("../config/config");
const {consumeFilteredMessage, publishUnfilteredMessage, consumeUnfilteredMessage } = require("./amqp");
const { createApp } = require("../authentication/app");
const { createDbConnection } = require("../database/db-connection");
const { createMessage } = require("../database/db-controller");

const activeUsers = new Set();

http.listen(SERVER_PORT, () => {
  console.log("Server is running on Port: " + SERVER_PORT);
});

createApp(app, disconnectUser);

createDbConnection();

io.on("connection", (socket) => {
  socket.on("joinRoom", (data) => {
    socket.join(data.room);
  });

  socket.on("message", (message) => {
    console.log("Message: " + JSON.stringify(message));
    publishUnfilteredMessage(message);
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
        if (user.room != data.room) {
          let oldRoom = user.room;
          io.to(oldRoom).emit("removeUser", user);
          io.to(data.room).emit("newUser", user);
          user.room = data.room;
          emitUsers(oldRoom);
        }
        return;
      }
    });

    if (isNewUser == true) {
      io.to(user.room).emit("newUser", user);
      activeUsers.add(user);
    }

    emitUsers(user.room);
  });
});

function emitUsers(room) {
  io.to(room).emit("roomUsers", {
    room: room,
    users: JSON.stringify(Array.from(activeUsers)),
  });
}

function emitMessage(payload) {
  createMessage(payload);
  io.to(payload.room).emit("message", payload.user + ": " + payload.message);
}

function disconnectUser(userName) {
  activeUsers.forEach((user) => {
    if (user.user == userName) {
      activeUsers.delete(user);
      io.to(user.room).emit("removeUser", user);
      emitUsers(user.room);
    }
  });
}

consumeUnfilteredMessage();
consumeFilteredMessage(emitMessage);

module.exports = {
  app,
  http,
};
