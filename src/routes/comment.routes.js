const router = require("express").Router();
const {
	commentOnPost,
	deleteComment,
	getCommentsForPost,
	getCommentsCount,
} = require("../controller/comment.controller");

router.post("/:postId", commentOnPost)
    .delete("/:postId/:commentId", deleteComment)
    .get("/:postId", getCommentsForPost)
    .get("/count/:postId", getCommentsCount);

module.exports = router;
