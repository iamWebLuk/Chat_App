const mongoose = require("mongoose");
const { MONGODBCONNECTION } = require("../config");

function createDbConnection() {
  mongoose.connect(MONGODBCONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

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

var messageSchema = new mongoose.Schema({
  message: String,
  user: String,
  room: String,
  timestamp: Date,
});

var messageModel = mongoose.model("Message", messageSchema);



module.exports = {
  messageModel,
  createDbConnection,
  getMessages
};
