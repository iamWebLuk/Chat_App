const { createMessageModel } = require("./models/message-model");
const { createUserModel } = require("./models/user-model");
const { mongoose } = require("./db-connection");

function getMessages(room) {
  return new Promise((resolve, reject) => {
    messageModel
      .find({ room: room }, (data) => {
        return data;
      })
      .then((data) => resolve(data))
      .catch((error) => console.log(error));
  });
}

function createMessage(message) {
  messageModel({
    message: message.message,
    user: message.user,
    room: message.room,
    timestamp: Date.now(),
  }).save((err) => {
    if (err) throw err;
    console.log("message saved");
  });
}

function getUsers() {
  return new Promise((resolve, reject) => {
    userModel
      .find()
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
}

function getUser(userName, userEmail) {
  return new Promise((resolve, reject) => {
    userModel
      .find({ name: userName })
      .then((users) => {
        if (Object.entries(users).length) {
          resolve(true);
        }
      })
      .then(() => {
        return userModel.find({ email: userEmail });
      })
      .then((users) => {
        if (Object.entries(users).length) {
          resolve(true);
        }
      })
      .then(() => resolve(false))
      .catch((err) => reject(err));
  });
}

function createUser(user) {
  userModel({
    name: user.name,
    email: user.email,
    password: user.password,
  }).save((err) => {
    if (err) throw err;
    console.log("user created");
  });
}

var messageModel = createMessageModel(mongoose);
var userModel = createUserModel(mongoose);

module.exports = {
  userModel,
  messageModel,
  getUser,
  getUsers,
  getMessages,
  createMessage,
  createUser,
};
