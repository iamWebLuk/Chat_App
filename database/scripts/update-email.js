//Only conceptual

const { createDbConnection, mongoose } = require("../db-connection");
const { createUserModel } = require("../models/user-model");
const userName = "TestUser"
const newEmail = "NewTestEmail"

createDbConnection();

const userModel = createUserModel(mongoose)

userModel.find({ name: userName })
    .then((user) => {
        return console.log("User name: " + JSON.stringify(user[0].name)+ ". Old email: " + JSON.stringify(user[0].email))
    })

userModel.findOneAndUpdate({ name: userName }, { email: newEmail })

userModel.find({ name: userName })
        .then((user) => {
            return console.log("User name: " + JSON.stringify(user[0].name) + ". New email: " + JSON.stringify(user[0].email))
        })
