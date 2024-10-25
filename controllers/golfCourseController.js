const { GolfCourse } = require("../models/GolfCourseSchema");
const PlayedCourses = require("../models/PlayedCoursesSchema");
const PublicUser = require("../models/PublicUserSchema");
const jwt = require("jsonwebtoken");

exports.createGolfCourse = async (req, res) => {
  try {
    const golfCourse = new GolfCourse(req.body);
    await golfCourse.save();
    res.status(201).send(golfCourse);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getTopCourses = async (req, res) => {
  try {
    const topCourses = await GolfCourse.find()
      .sort({ totalTimesPlayed: -1 })
      .limit(10);
    res.status(200).send(topCourses);
  } catch (err) {
    console.log("ERROR:" + err);
    res.status(500).send(err);
  }
};

exports.searchCourses = async (req, res) => {
  try {
    const { query } = req.query;
    const results = await GolfCourse.find({
      courseName: { $regex: query, $options: "i" },
    }).limit(10);
    res.status(200).send(results);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updatePlayedCourses = async (req, res) => {
  const { userId } = req.params;
  const updateData = req.body;
  const score = parseInt(updateData.score);

  try {
    // Attempt to update an existing course within the playedCourses array
    const result = await PlayedCourses.updateOne(
      { userId, "playedCourses.courseId": updateData.courseId },
      {
        $inc: {
          "playedCourses.$.totalTimesPlayed": 1,
          "playedCourses.$.totalScoreSum": score,
        },
        $min: {
          "playedCourses.$.lowestScore": score,
        },
        $max: {
          "playedCourses.$.highestScore": score,
        },
      }
    );

    if (result.modifiedCount === 0) {
      // If no course was modified, the course has not been played, so push a new course
      await PlayedCourses.updateOne(
        { userId },
        {
          $push: {
            playedCourses: {
              ...updateData,
              lowestScore: score,
              highestScore: score,
              totalTimesPlayed: 1,
              totalScoreSum: score,
            },
          },
        },
        { upsert: true }
      );
    }

    // Now update the GolfCourse collection
    const golfCourse = await GolfCourse.findOne({ _id: updateData.courseId });
    golfCourse.totalTimesPlayed = golfCourse.totalTimesPlayed
      ? golfCourse.totalTimesPlayed + 1
      : 1;
    golfCourse.totalScoreSum = golfCourse.totalScoreSum
      ? golfCourse.totalScoreSum + score
      : score;
    golfCourse.lowestScore = golfCourse.lowestScore
      ? Math.min(golfCourse.lowestScore, score)
      : score;
    golfCourse.highestScore = golfCourse.highestScore
      ? Math.max(golfCourse.highestScore, score)
      : score;

    await golfCourse.save();

    // Update Public Player golf stats
    const publicUser = await PublicUser.findById(userId);
    const curHighScore = publicUser.highScore;
    const curLowScore = publicUser.lowScore;
    publicUser.highScore = curHighScore ? Math.max(curHighScore, score) : score;
    publicUser.lowScore = curLowScore ? Math.min(curLowScore, lowScore) : score;
    publicUser.totalPlays += 1;
    publicUser.totalScoreSum += score;
    if (curHighScore !== publicUser.highScore) {
      publicUser.highRound.courseId = updateData.courseId;
      publicUser.highRound.courseName = updateData.courseName;
    }
    if (curLowScore !== publicUser.lowScore) {
      publicUser.lowRound.courseId = updateData.courseId;
      publicUser.lowRound.courseName = updateData.courseName;
    }

    publicUser.save();

    res
      .status(200)
      .json({ message: "Course updated successfully", user: publicUser });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getPlayedCourses = async (req, res) => {
  const { userId } = req.params;
  try {
    const playedCourses = await PlayedCourses.findOne({ userId });
    res.status(200).json(playedCourses);
  } catch (err) {
    res.status(500).send(err);
  }
};
