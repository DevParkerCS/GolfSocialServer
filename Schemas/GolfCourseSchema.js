const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the golf course
const GolfCourseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String, // Optional, no required field
      required: false,
    },
  },
  slopeRating: {
    type: Number,
    required: true,
  },
});

// Create the model from the schema and export it
const GolfCourse = mongoose.model("GolfCourse", GolfCourseSchema);
module.exports = GolfCourse;
