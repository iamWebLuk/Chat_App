const { createDbConnection} = require("../db-connection");
const { createMessageModel } = require("../models/message-model");
const { createUserModel } = require("../models/user-model");

const mongoose = createDbConnection();

createMessageModel(mongoose)
  .deleteMany()
  .then(() => console.log("messages deleted"));

createUserModel(mongoose)
  .deleteMany()
  .then(() => console.log("users deleted"));
