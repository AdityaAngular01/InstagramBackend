const router = require("express").Router();
const {
	likePost,
	unlikePost,
	getLikesCount,
} = require("../controller/like.controller");

router
	.post("/:postId", likePost)
	.delete("/:postId", unlikePost)
	.get("/count/:postId", getLikesCount);
module.exports = router;
