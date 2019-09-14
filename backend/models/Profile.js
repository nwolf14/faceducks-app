const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String
  },
  avatar: {
    type: String
  },
  creditCardNumber: {
    type: Number
  },
  city: {
    type: String
  },
  zipCode: {
    type: String
  },
  country: {
    type: String
  },
  phoneNumber: {
    type: Number
  },
  isPhoneConfirmed: {
    type: Boolean,
    default: false
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("profiles", ProfileSchema);
