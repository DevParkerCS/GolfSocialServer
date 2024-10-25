const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");
const loginController = require("../controllers/loginController");
const logoutController = require("../controllers/logoutController");

router.post("/register", registerController.registerAccount);
router.get("/validateToken", registerController.getTokenValidated);
router.post("/login", loginController.postLogin);
router.post("/logout", logoutController.postLogout);

module.exports = router;
