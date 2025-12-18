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
    // Regex to validate basic email structure
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: true,
    minlength: 5, // minimum 5 characters
  },
});

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
