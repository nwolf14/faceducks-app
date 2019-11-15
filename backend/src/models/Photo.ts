export {};
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
  author: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false 
  },
  hashtagsList: {
    type: Array,
    required: true
  },
  photo: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

let Photo;

module.exports = Photo = mongoose.model("photo", PhotoSchema);
