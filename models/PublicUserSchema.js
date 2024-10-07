const mongoose = require("mongoose");

const publicUserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    followers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "PublicUser", index: true },
    ],
    following: [
      { type: mongoose.Schema.Types.ObjectId, ref: "PublicUser", index: true },
    ],
    numFollowers: { type: Number, default: 0 },
    numFollowing: { type: Number, default: 0 },
    totalScoreSum: { type: Number, default: null },
    totalPlays: { type: Number, default: null },
    lowScore: { type: Number, default: null },
    highScore: { type: Number, default: null },
    mostPlayed: {
      courseName: { type: String, default: null },
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "GolfCourse" },
      default: {},
    },
    lowRound: {
      courseName: { type: String, default: null },
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "GolfCourse" },
      default: {},
    },
    highRound: {
      courseName: { type: String, default: null },
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "GolfCourse" },
      default: {},
    },
  },
  { timestamps: true }
);

const PublicUser = mongoose.model("PublicUser", publicUserSchema);

module.exports = PublicUser;
