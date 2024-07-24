const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  username: { type: String, required: true },
  userId: { type: String, required: true },
  text: { type: String, required: true },
  likeCount: { type: Number, default: 0 },
  postId: { type: String, required: true },
});

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
