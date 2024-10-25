const express = require("express");
const router = express.Router();

const golfCourseRoutes = require("./golfCourse");
const postRoutes = require("./post");
const commentRoutes = require("./comment");
const RegisterRoutes = require("./Register");
const UserRoutes = require("./user");

router.use(golfCourseRoutes);
router.use(postRoutes);
router.use(commentRoutes);
router.use(RegisterRoutes);
router.use(UserRoutes);

module.exports = router;
