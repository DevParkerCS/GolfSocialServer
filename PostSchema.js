const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  messageId: { type: String, required: true },
  username: { type: String, required: true },
  userId: { type: String, required: true },
  likeCount: { type: Number, default: 0 },
  comments: [this], // Recursive subdocuments for nested comments
});

const PostSchema = new Schema(
  {
    username: { type: String, required: true },
    userId: { type: String, required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    likeCount: { type: Number, default: 0 },
    numComments: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Create the model from the schema and export it
const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
