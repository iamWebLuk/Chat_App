//Only conceptual

const { createDbConnection, mongoose } = require("../db-connection");
const { createUserModel } = require("../models/user-model");
const userName = "TestUser";
const newEmail = "NewTestEmail";
const oldEmail = "OldTestEmail";

createDbConnection();

const userModel = createUserModel(mongoose);

userModel
  .find({ name: userName })
  .then((user) => {
    return console.log(
      "User name: " +
        JSON.stringify(user[0].name) +
        ". Old email: " +
        JSON.stringify(user[0].email)
    );
  })

  .then(() => {
    userModel.findOneAndUpdate(
      { name: userName },
      { email: newEmail },
      { useFindAndModify: false },
      () => {
        return;
      }
    );
  })

  .then(() => {
    userModel.find({ name: userName }).then((user) => {
      return console.log(
        "User name: " +
          JSON.stringify(user[0].name) +
          ". New email: " +
          JSON.stringify(user[0].email)
      );
    });
  })
  .then(() => {
    userModel.findOneAndUpdate(
      { name: userName },
      { email: oldEmail },
      { useFindAndModify: false },
      () => {
        return;
      }
    );
  })
  .then(() => {
    userModel.find({ name: userName }).then((user) => {
      return console.log(
        "User name: " +
          JSON.stringify(user[0].name) +
          ". Old email: " +
          JSON.stringify(user[0].email)
      );
    });
  });
