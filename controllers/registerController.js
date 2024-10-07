const {
  generateAccessToken,
  generateRefreshToken,
  validatePassword,
} = require("../utils/Authentication");
const SecureUser = require("../models/SecureUserSchema");
const bcrypt = require("bcrypt");
const PublicUser = require("../models/PublicUserSchema");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;
const SECRET_REFRESH_KEY = process.env.SECRET_REFRESH_KEY;

exports.getTokenValidated = async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ isValid: false, message: "No token found" });
  }

  if (!accessToken) {
    // Verify the refresh token if accessToken is missing or expired
    return jwt.verify(refreshToken, SECRET_REFRESH_KEY, async (err, user) => {
      if (err) {
        return res
          .status(403)
          .json({
            isValid: false,
            message: "Refresh token expired or invalid",
          });
      }

      try {
        // Find user in the database
        const foundUser = await PublicUser.findOne({ _id: user.userId });
        if (!foundUser) {
          return res
            .status(404)
            .json({ isValid: false, message: "User not found" });
        }

        // Generate a new access token
        const newAccessToken = generateAccessToken(foundUser);

        // Set the new access token in the cookie
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true, // For security, prevent JavaScript access
          secure: process.env.NODE_ENV === "production", // Use HTTPS in production
          sameSite: "Strict",
          maxAge: 60 * 60 * 1000, // 1 hour
        });

        return res
          .status(200)
          .json({ isValid: true, message: "Token refreshed", user: foundUser });
      } catch (err) {
        return res
          .status(500)
          .json({ isError: true, message: "Server error", err });
      }
    });
  }

  // If accessToken exists, verify it
  jwt.verify(accessToken, SECRET_KEY, async (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ isValid: false, message: "Access token expired or invalid" });
    }

    try {
      // Find the user in the database
      const foundUser = await PublicUser.findOne({ _id: user.userId });
      if (!foundUser) {
        return res
          .status(404)
          .json({ isValid: false, message: "User not found" });
      }

      // Token is valid, return the user
      return res
        .status(200)
        .json({
          isValid: true,
          message: "Access token is valid",
          user: foundUser,
        });
    } catch (err) {
      return res
        .status(500)
        .json({ isError: true, message: "Server error", err });
    }
  });
};

exports.registerAccount = async (req, res) => {
  const { email, password, username } = req.body;

  if (!validatePassword(password)) {
    return res.status(200).json({
      isError: true,
      message:
        "Password must be at least 6 characters long, contain one number, one special character, and one uppercase letter.",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(200)
      .json({ isError: true, message: "Invalid email address" });
  }

  try {
    const existingUser = await SecureUser.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (existingUser?.email === email) {
      return res
        .status(200)
        .json({ isError: true, message: "Email already in use" });
    }

    if (existingUser?.username === username) {
      return res
        .status(200)
        .json({ isError: true, message: "Username already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new SecureUser({
      email,
      password: hashedPassword,
      username,
    });
    const newPublicUser = new PublicUser(newUser);

    await newUser.save();
    await newPublicUser.save();
    const accessToken = generateAccessToken(newUser);
    generateRefreshToken(newUser);

    res.cookie("accessToken", accessToken, {
      httpOnly: false,
      secure: false,
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000, // 1hr limit
    });

    // Send success response
    return res.status(201).json({
      message: "User registered successfully",
      user: newPublicUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
