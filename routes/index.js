const express = require("express");
const router = express.Router();

const golfCourseRoutes = require("./golfCourse");
const postRoutes = require("./post");
const commentRoutes = require("./comment");
const RegisterRoutes = require("./Register");

router.use(golfCourseRoutes);
router.use(postRoutes);
router.use(commentRoutes);
router.use(RegisterRoutes);

module.exports = router;
