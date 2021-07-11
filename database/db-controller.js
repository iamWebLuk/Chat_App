const { createMessageModel } = require("./models/message-model");
const { createUserModel } = require("./models/user-model");
const { createSwearwordModel } = require("./models/swearword-model");
const { mongoose } = require("./db-connection");

function getMessages(room) {
  return new Promise((resolve, reject) => {
    messageModel
      .find({ room: room }, (data) => {
        return data;
      })
      .then((data) => resolve(data))
      .catch((err) => reject(err));
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

function checkUserExists(userName, userEmail) {
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

function filterMessage(message) {
  const filter = [];
  var splitMessage = message.split(" ");

  splitMessage.forEach((element) => {
    filter.push(filterSwearword(element));
  });

  function filterSwearword(element) {
    return new Promise((resolve, reject) => {
      findSwearword(element)
        .then((isSwearword) => {
          if (isSwearword == true) {
            resolve("*".repeat(element.length));
          } else {
            resolve(element);
          }
        })
        .catch((err) => reject(err));
    });
  }

  return Promise.all(filter).then((data) => {
    return data.join(" ");
  });
}

function findSwearword(element) {
  return new Promise((resolve, reject) => {
    swearwordModel
      .find({ word: element })
      .then((word) => {
        if (Object.entries(word).length) {
          resolve(true);
        }
      })
      .then(() => resolve(false))
      .catch((err) => reject(err));
  });
}

var messageModel = createMessageModel(mongoose);
var userModel = createUserModel(mongoose);
var swearwordModel = createSwearwordModel(mongoose);

module.exports = {
  userModel,
  messageModel,
  swearwordModel,
  checkUserExists,
  getUsers,
  getMessages,
  createMessage,
  createUser,
  filterMessage,
};
