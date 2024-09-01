const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const secureUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetToken: { type: String },
});

// Pre-save hook to hash the password
secureUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with the hashed password
secureUserSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const SecureUser = mongoose.model("SecureUser", secureUserSchema);

module.exports = SecureUser;
