const express = require("express");
const router = express.Router();
const PublicUserController = require("../controllers/publicUserController");

router.get("/publicUser", PublicUserController.getPublicUser);

module.exports = router;
