const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connectDB = require("./config/db");
const SecureUser = require("./models/SecureUserSchema");
require("dotenv").config();

const app = express();
app.use(express.json());
connectDB();

const SECRET_KEY = process.env.SECRET_KEY;
const port = process.env.PORT || 3000;

// Password validation function
const validatePassword = (password) => {
  const lengthCheck = password.length >= 6;
  const numberCheck = /\d/.test(password);
  const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const uppercaseCheck = /[A-Z]/.test(password);
  return lengthCheck && numberCheck && specialCharCheck && uppercaseCheck;
};

app.post("/api/register", async (req, res) => {
  const { email, password, username } = req.body;

  if (!validatePassword(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 6 characters long, contain one number, one special character, and one uppercase letter.",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  try {
    const existingUser = await SecureUser.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (existingUser?.email === email) {
      return res.status(400).json({ message: "Email already in use" });
    }

    if (existingUser?.username === username) {
      return res.status(400).json({ message: "Username already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new SecureUser({
      email,
      password: hashedPassword,
      username,
    });

    await newUser.save();

    // Create a JWT token
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      SECRET_KEY,
      {
        expiresIn: "1h", // Token expiration (1 hour)
      }
    );

    // Set the token in an HTTP-only secure cookie
    res.cookie("token", token, {
      httpOnly: true, // Can't be accessed via JavaScript
      secure: process.env.NODE_ENV === "production", // Only in HTTPS in production
      sameSite: "Strict", // Prevent CSRF attacks
      maxAge: 3600000, // 1 hour in milliseconds
    });

    // Send success response
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
