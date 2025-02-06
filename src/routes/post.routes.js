const router = require("express").Router();
const {
	createPost,
	getAllPosts,
	getPostById,
	getPostsByUser,
	deletePost,
} = require("../controller/post.controller");

router
	.post("/", createPost)
	.get("/", getAllPosts)
	.get("/:postId", getPostById)
	.get("/user/:userId", getPostsByUser)
	.delete("/:postId", deletePost);

module.exports = router;
