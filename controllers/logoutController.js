const RefreshToken = require("../models/RefreshTokenSchema");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_REFRESH_KEY = process.env.SECRET_REFRESH_KEY;

exports.postLogout = async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    // Clear the access token cookie if it exists, even if the refresh token is missing
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    return res.status(200).send("User is not logged in");
  }

  return jwt.verify(refreshToken, SECRET_REFRESH_KEY, async (err, user) => {
    if (err) {
      // Clear the cookies even if the refresh token is expired or invalid
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      return res.status(400).json({
        isValid: false,
        message: "Refresh token expired or invalid",
      });
    }

    try {
      res.clearCookie("accessToken", {
        httpOnly: false, // Should match how it was set
        secure: false, // Same as when setting
        sameSite: "Strict",
        domain: "localhost",
        path: "/",
      });

      res.clearCookie("refreshToken", {
        httpOnly: true, // Should match how it was set
        secure: false, // Same as when setting
        sameSite: "Strict",
        domain: "localhost",
        path: "/",
      });
      // Check if the refresh token exists and delete it from the database
      const deletedToken = await RefreshToken.findOneAndDelete({
        refreshToken: refreshToken,
        userId: user.userId,
      });

      if (!deletedToken) {
        return res.status(403).json({
          isValid: false,
          message: "Refresh token is invalid or revoked",
        });
      }

      return res.status(200).json({
        message: "Logout successful",
      });
    } catch (err) {
      return res
        .status(500)
        .json({ isError: true, message: "Server error", err });
    }
  });
};
