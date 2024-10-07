const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/Authentication");
const SecureUser = require("../models/SecureUserSchema");
const PublicUser = require("../models/PublicUserSchema");

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const foundUser = await SecureUser.findOne({ email });
    if (!foundUser || !foundUser.comparePassword(password)) {
      return res
        .status(200)
        .json({ isError: true, message: "Incorrect Email/Password" });
    } else {
      const accessToken = generateAccessToken(foundUser);
      const refreshToken = await generateRefreshToken(foundUser).catch(
        (err) => {
          res
            .status(500)
            .send({ isError: true, message: "Failed to load profile." });
          return;
        }
      );
      const publicUser = await PublicUser.findById(foundUser._id);

      res.cookie("accessToken", accessToken, {
        httpOnly: false,
        secure: false,
        sameSite: "Strict",
        maxAge: 60 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(201).json({ isError: false, user: publicUser });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
