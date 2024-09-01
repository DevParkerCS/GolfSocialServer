const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the golf course
const GolfCourseSchema = new Schema({
  courseName: {
    type: String,
    required: true,
    index: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GolfCourse", // Referencing the GolfCourse collection
    required: true,
  },
  courseState: {
    type: String,
    required: true,
  },
  courseCity: {
    type: String,
    required: true,
  },
  coursePar: {
    type: Number,
    required: true,
  },
  totalTimesPlayed: {
    type: Number,
    default: null,
  },
  lowestScore: {
    type: Number,
    default: null,
  },
  highestScore: {
    type: Number,
    default: null,
  },
  totalScoreSum: {
    type: Number,
    default: null,
  },
  courseYards: {
    type: Number,
    required: true,
  },
});

// Create the model from the schema and export it
const GolfCourse = mongoose.model("GolfCourse", GolfCourseSchema);
module.exports = { GolfCourse, GolfCourseSchema };
