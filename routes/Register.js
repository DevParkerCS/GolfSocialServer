const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");
const loginController = require("../controllers/loginController");

router.post("/register", registerController.registerAccount);
router.get("/validateToken", registerController.getTokenValidated);
router.post("/login", loginController.postLogin);

module.exports = router;
