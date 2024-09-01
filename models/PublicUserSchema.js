const mongoose = require("mongoose");

const publicUserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "PublicUser" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "PublicUser" }],
});

const PublicUser = mongoose.model("PublicUser", publicUserSchema);

module.exports = PublicUser;
