function createUserModel(mongoose) {
  var userSchema = new mongoose.Schema({
    id: String,
    name: String,
    email: String,
    password: String,
  });

  return mongoose.model("User", userSchema);
}

module.exports = {
  createUserModel,
};
