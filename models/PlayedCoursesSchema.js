const mongoose = require("mongoose");
const { GolfCourseSchema } = require("./GolfCourseSchema");
const Schema = mongoose.Schema;

const PlayedCourseSchema = new Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GolfCourse", // Referencing the GolfCourse collection
      required: true,
    },
    courseName: {
      type: String,
      required: true,
      index: true,
    },
    courseCity: {
      type: String,
      required: true,
    },
    courseState: {
      type: String,
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
  },
  { _id: false }
);

const PlayedCoursesSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  playedCourses: [PlayedCourseSchema],
});

const PlayedCourses = mongoose.model("PlayedCourses", PlayedCoursesSchema);

module.exports = PlayedCourses;
