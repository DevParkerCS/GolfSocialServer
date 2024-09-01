const express = require("express");
const router = express.Router();

const golfCourseRoutes = require("./golfCourse");
const postRoutes = require("./post");
const commentRoutes = require("./comment");

router.use(golfCourseRoutes);
router.use(postRoutes);
router.use(commentRoutes);

module.exports = router;
