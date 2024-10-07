const express = require("express");
const router = express.Router();
const golfCourseController = require("../controllers/golfCourseController");

const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken; // Get token from cookie

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user; // Attach user info to request
    next(); // Proceed to the protected route
  });
};

router.post("/golfcourses", golfCourseController.createGolfCourse);
router.get("/topCourses", golfCourseController.getTopCourses);
router.get("/searchCourses", golfCourseController.searchCourses);
router.put("/playedCourses/:userId", golfCourseController.updatePlayedCourses);
router.get("/playedCourses/:userId", golfCourseController.getPlayedCourses);

module.exports = router;
