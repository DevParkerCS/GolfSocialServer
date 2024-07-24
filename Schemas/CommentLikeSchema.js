const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentLikeSchema = new Schema({
  userId: {
    type: String,
    ref: "User",
    required: true,
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
});

const CommentLike = mongoose.model("CommentLike", commentLikeSchema);
module.exports = CommentLike;
