const PublicUser = require("../models/PublicUserSchema");

exports.getPublicUser = async (req, res) => {
  const userID = req.query.userID;
  try {
    foundUser = await PublicUser.findById(userID);
    res.status(200).json(foundUser);
  } catch (err) {
    res.status(400).json({ err, msg: "User Not Found" });
  }
};
