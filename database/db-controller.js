const { createMessageModel } = require("./models/message-model");
const { createUserModel } = require("./models/user-model");
const { mongoose } = require("./db-connection");

function getMessages() {
  return new Promise((resolve, reject) => {
    messageModel
      .find({ room: "Room1" }, (data) => {
        return data;
      })
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
}

function getUser() {
  return new Promise((resolve, reject) => {
    userModel
      .find({ name: "123" }, (data) => {
        return data;
      })
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
}

function createMessage(message){
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

var messageModel = createMessageModel(mongoose);
var userModel = createUserModel(mongoose);

module.exports = {
    userModel,
    messageModel,
    getUser,
    getMessages,
    createMessage
  };