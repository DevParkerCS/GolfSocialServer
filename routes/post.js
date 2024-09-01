const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.post("/posts", postController.createPost);
router.get("/posts", postController.getPosts);
router.post("/likePost", postController.likePost);
router.post("/unlikePost", postController.unlikePost);
router.get("/isPostLiked", postController.isPostLiked);

module.exports = router;
