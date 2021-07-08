const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const { consumeMessage, publishMessage } = require("./amqp");
const { createApp } = require("./app");
const activeUsers = new Set();
const { SERVER_PORT} = require("../config");


http.listen(SERVER_PORT, () => {
  console.log("Server is running on Port: " + SERVER_PORT);
});

createApp(app);

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

consumeMessage(emitMessage);

module.exports = {
  app,
};