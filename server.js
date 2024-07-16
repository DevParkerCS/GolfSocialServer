const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const GolfCourse = require("./GolfCourse"); // Import the GolfCourse model
const Post = require("./PostSchema");
const Like = require("./LikeSchema");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// Define a route to create a new golf course
app.post("/golfcourses", async (req, res) => {
  try {
    const golfCourse = new GolfCourse(req.body);
    await golfCourse.save();
    res.status(201).send(golfCourse);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Define a route to get all golf courses
app.get("/golfcourses", async (req, res) => {
  try {
    const golfCourses = await GolfCourse.find();
    res.status(200).send(golfCourses);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/posts", async (req, res) => {
  try {
    console.log(req.body);
    const newPost = new Post(req.body);
    await newPost.save();
    res.status(201).send(newPost);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).send(posts);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/like", async (req, res) => {
  const { userId, postId } = req.body;

  try {
    // Create a new like
    const like = new Like({ userId, postId });
    await like.save();

    // Update the like count in the post
    await Post.findByIdAndUpdate(postId, { $inc: { likeCount: 1 } });

    res.status(201).send(like);
  } catch (err) {
    console.error("Error saving like:", err); // Log the error for debugging
    res.status(500).send(err);
  }
});

app.post("/unlike", async (req, res) => {
  const { userId, postId } = req.body;
  try {
    await Like.deleteOne({ userId, postId });

    // Update the like count in the post
    await Post.findByIdAndUpdate(postId, { $inc: { likeCount: -1 } });

    res.status(200).send("Post unliked");
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/isLiked", async (req, res) => {
  const { postId, userId } = req.query;

  try {
    const like = await Like.findOne({ userId, postId });
    res.status(200).send(!!like);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
