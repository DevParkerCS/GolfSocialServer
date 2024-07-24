const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const GolfCourse = require("./Schemas/GolfCourseSchema"); // Import the GolfCourse model
const Post = require("./Schemas/PostSchema");
const LikePost = require("./Schemas/PostLikeSchema");
const Comment = require("./Schemas/CommentSchema");
const CommentLike = require("./Schemas/CommentLikeSchema");

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

app.post("/golfcourses", async (req, res) => {
  try {
    const golfCourse = new GolfCourse(req.body);
    await golfCourse.save();
    res.status(201).send(golfCourse);
  } catch (err) {
    res.status(400).send(err);
  }
});

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

app.post("/likePost", async (req, res) => {
  const { userId, postId } = req.body;
  try {
    const likePost = new LikePost({ userId, postId });
    await likePost.save();
    await Post.findByIdAndUpdate(postId, { $inc: { likeCount: 1 } });

    res.status(201).send(likePost);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/unlikePost", async (req, res) => {
  const { userId, postId } = req.body;
  try {
    await LikePost.deleteOne({ userId, postId });

    // Update the like count in the post
    await Post.findByIdAndUpdate(postId, { $inc: { likeCount: -1 } });

    res.status(200).send("Post unliked");
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/isPostLiked", async (req, res) => {
  const { postId, userId } = req.query;

  try {
    const likePost = await LikePost.findOne({ userId, postId });
    res.status(200).send(!!likePost);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/comments", async (req, res) => {
  const { postId } = req.query;

  try {
    const comments = await Comment.find({ postId }).sort({ likeCount: -1 });
    res.status(200).send(comments);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/comments", async (req, res) => {
  const { comment, postId } = req.body;
  try {
    console.log(comment);
    const newComment = new Comment(comment);
    await newComment.save();
    await Post.findByIdAndUpdate(postId, { $inc: { numComments: 1 } });
    res.status(200).send(newComment);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/likeComment", async (req, res) => {
  const { commentId, userId } = req.body;
  try {
    const newLike = new CommentLike({ userId, commentId });
    await newLike.save();
    await Comment.findByIdAndUpdate(commentId, { $inc: { likeCount: 1 } });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/unlikeComment", async (req, res) => {
  const { commentId, userId } = req.body;
  try {
    await CommentLike.deleteOne({ commentId, userId });
    await Comment.findByIdAndUpdate(commentId, { $inc: { likeCount: -1 } });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/isCommentLiked", async (req, res) => {
  const { commentId, userId } = req.query;

  try {
    const likeComment = await CommentLike.findOne({ commentId, userId });
    res.status(200).send(!!likeComment);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
