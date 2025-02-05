const router = require("express").Router();
const {
	createPost,
	getAllPosts,
	getPostById,
	getPostsByUser,
	getCommentsForPost,
	deletePost,
	likePost,
	unlikePost,
	commentOnPost,
	deleteComment,
} = require("../controller/post.controller");

router
	.post("/", createPost)
	.get("/", getAllPosts)
	.get("/:postId", getPostById)
	.get("/:postId/comments", getCommentsForPost)
	.get("/user/:userId", getPostsByUser)
	.post("/:postId/like", likePost)
	.post("/:postId/unlike", unlikePost)
	.post("/:postId/comment", commentOnPost)
	.delete("/:postId/comment/:commentId", deleteComment)
	.delete("/:postId", deletePost);

module.exports = router;
