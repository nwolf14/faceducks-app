const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const JobSchema = new Schema({
  employer: {
    type: Schema.Types.ObjectId,
    ref: "profiles"
  },
  title: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  pricePerHour: {
    type: Number
  },
  priceOverall: {
    type: String
  },
  requirements: [
    {
      type: String
    }
  ],
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "open"
  },
  worker: {
    type: Schema.Types.ObjectId,
    ref: "profiles"
  },
  comments: [
    {
      profile: {
        type: Schema.Types.ObjectId,
        ref: "profiles"
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = Job = mongoose.model("jobs", JobSchema);
