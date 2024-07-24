const mongoose = require("mongoose");
const { Schema } = mongoose;

const postLikeSchema = new Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);

const PostLike = mongoose.model("PostLike", postLikeSchema);
module.exports = PostLike;
