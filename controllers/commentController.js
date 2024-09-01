const Comment = require("../models/CommentSchema");
const CommentLike = require("../models/CommentLikeSchema");
const Post = require("../models/PostSchema");

exports.createComment = async (req, res) => {
  const { comment, postId } = req.body;
  try {
    const newComment = new Comment(comment);
    await newComment.save();
    await Post.findByIdAndUpdate(postId, { $inc: { numComments: 1 } });
    res.status(200).send(newComment);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getComments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const date = req.query.timeStamp || new Date().toISOString();
    const postId = req.query.postId;

    if (!postId) {
      return res.status(400).send({ error: "postId is required" });
    }

    const startIndex = (page - 1) * 10;

    const comments = await Comment.find({ createdAt: { $lte: date }, postId })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(10);

    res.status(200).send({
      comments,
      nextPage: comments.length < 10 ? page : page + 1,
      date,
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.likeComment = async (req, res) => {
  const { commentId, userId } = req.body;
  try {
    const newLike = new CommentLike({ userId, commentId });
    await newLike.save();
    await Comment.findByIdAndUpdate(commentId, { $inc: { likeCount: 1 } });
    res.status(201).send(newLike);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.unlikeComment = async (req, res) => {
  const { commentId, userId } = req.body;
  try {
    await CommentLike.deleteOne({ commentId, userId });
    await Comment.findByIdAndUpdate(commentId, { $inc: { likeCount: -1 } });
    res.status(200).send("Comment unliked");
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.isCommentLiked = async (req, res) => {
  const { commentId, userId } = req.query;

  try {
    const likeComment = await CommentLike.findOne({ commentId, userId });
    res.status(200).send(!!likeComment);
  } catch (err) {
    res.status(500).send(err);
  }
};
