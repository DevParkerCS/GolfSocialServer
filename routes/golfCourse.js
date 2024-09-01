const express = require("express");
const router = express.Router();
const golfCourseController = require("../controllers/golfCourseController");

router.post("/golfcourses", golfCourseController.createGolfCourse);
router.get("/topCourses", golfCourseController.getTopCourses);
router.get("/searchCourses", golfCourseController.searchCourses);
router.put("/playedCourses/:userId", golfCourseController.updatePlayedCourses);
router.get("/playedCourses/:userId", golfCourseController.getPlayedCourses);

module.exports = router;
