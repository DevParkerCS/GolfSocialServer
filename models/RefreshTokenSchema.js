const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  refreshToken: { type: String, required: true, unique: true },
  expiresAt: { type: String, required: true },
});

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
module.exports = RefreshToken;
