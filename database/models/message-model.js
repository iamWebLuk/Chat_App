function createMessageModel(mongoose) {
  var messageSchema = new mongoose.Schema({
    message: String,
    user: String,
    room: String,
    timestamp: Date,
  });

  return mongoose.model("Message", messageSchema);
}

module.exports = {
  createMessageModel,
};
