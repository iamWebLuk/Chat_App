function createSwearwordModel(mongoose) {
    var swearwordSchema = new mongoose.Schema({
      word: String,
    });
  
    return mongoose.model("Swearword", swearwordSchema);
  }
  
  module.exports = {
    createSwearwordModel,
  };
  