const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: true,
    minlength: 5, 
  },
  role:{
    type:String,
    default:'user'
  }
});

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
