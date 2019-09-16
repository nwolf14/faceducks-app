export {};
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  login: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  is_mail_confirmed: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

let User;

module.exports = User = mongoose.model("users", UserSchema);
