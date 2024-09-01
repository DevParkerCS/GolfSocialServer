const Post = require("../models/PostSchema");
const LikePost = require("../models/PostLikeSchema");

exports.createPost = async (req, res) => {
  try {
    const newPost = new Post(req.body);
    await newPost.save();
    res.status(201).send(newPost);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const date = req.query.date || new Date().toISOString();
    const startIndex = (page - 1) * 10;
    const userId = req.query.userId;
    let posts;

    if (userId) {
      posts = await Post.find({ createdAt: { $lte: date }, userId })
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(10);
    } else {
      posts = await Post.find({ createdAt: { $lte: date } })
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(10);
    }

    res.status(200).send({
      posts,
      nextPage: posts.length < 10 ? page : page + 1,
      date,
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.likePost = async (req, res) => {
  const { userId, postId } = req.body;
  try {
    const likePost = new LikePost({ userId, postId });
    await likePost.save();
    await Post.findByIdAndUpdate(postId, { $inc: { likeCount: 1 } });

    res.status(201).send(likePost);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.unlikePost = async (req, res) => {
  const { userId, postId } = req.body;
  try {
    await LikePost.deleteOne({ userId, postId });

    await Post.findByIdAndUpdate(postId, { $inc: { likeCount: -1 } });

    res.status(200).send("Post unliked");
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.isPostLiked = async (req, res) => {
  const { postId, userId } = req.query;

  try {
    const likePost = await LikePost.findOne({ userId, postId });
    res.status(200).send(!!likePost);
  } catch (err) {
    res.status(500).send(err);
  }
};
