const mongoose = require("mongoose");

const publicUserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "PublicUser" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "PublicUser" }],
  numFollowers: { type: Number, default: 0 },
  numFollowing: { type: Number, default: 0 },
});

const PublicUser = mongoose.model("PublicUser", publicUserSchema);

module.exports = PublicUser;
