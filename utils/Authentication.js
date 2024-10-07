const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const RefreshToken = require("../models/RefreshTokenSchema");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;
const SECRET_REFRESH_KEY = process.env.SECRET_REFRESH_KEY;

exports.generateAccessToken = (user) => {
  return jwt.sign({ userId: user._id, username: user.username }, SECRET_KEY, {
    expiresIn: "1h",
  });
};

exports.generateRefreshToken = async (user) => {
  try {
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      SECRET_REFRESH_KEY,
      {
        expiresIn: "7d",
      }
    );
    const encryptedToken = await bcrypt.hash(token, 10);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    const refreshToken = new RefreshToken({
      expiresAt: expiryDate,
      userId: user._id,
      refreshToken: encryptedToken,
    });

    await refreshToken.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

exports.validatePassword = (password) => {
  const lengthCheck = password.length >= 6;
  const numberCheck = /\d/.test(password);
  const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const uppercaseCheck = /[A-Z]/.test(password);
  return lengthCheck && numberCheck && specialCharCheck && uppercaseCheck;
};
