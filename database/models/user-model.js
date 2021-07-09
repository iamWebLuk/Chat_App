function createUserModel(mongoose) {
  var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
  });

  return mongoose.model("User", userSchema);
}

module.exports = {
  createUserModel,
};
