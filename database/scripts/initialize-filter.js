const { createDbConnection, mongoose } = require("../db-connection");
const { createSwearwordModel } = require("../models/swearword-model");

createDbConnection();

createSwearwordModel(mongoose)
  .insertMany([
    { word: "fuck" },
    { word: "shit" },
    { word: "piss" },
    { word: "dick" },
    { word: "ass" },
    { word: "bitch" },
    { word: "bastard" },
    { word: "cunt" },
    { word: "twat" },
  ])
  .then(() => {
    console.log("swearwords inserted");
  })
  .catch((err) => console.log(err));
