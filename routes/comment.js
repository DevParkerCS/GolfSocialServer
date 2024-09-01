const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

router.post("/comments", commentController.createComment);
router.get("/comments", commentController.getComments);
router.post("/likeComment", commentController.likeComment);
router.post("/unlikeComment", commentController.unlikeComment);
router.get("/isCommentLiked", commentController.isCommentLiked);

module.exports = router;
