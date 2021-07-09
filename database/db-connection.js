const mongoose = require("mongoose");
const { MONGODBCONNECTION } = require("../config");

function createDbConnection() {
  mongoose.connect(MONGODBCONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = {
  createDbConnection,
  mongoose
};
