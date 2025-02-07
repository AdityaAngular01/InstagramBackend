const router = require("express").Router();
const {
	commentOnPost,
	deleteComment,
	getCommentsForPost,
	getCommentsCount,
	updateComment
} = require("../controller/comment.controller");

router.post("/:postId", commentOnPost)
    .delete("/:postId/:commentId", deleteComment)
    .get("/:postId", getCommentsForPost)
    .get("/count/:postId", getCommentsCount)
	.put(`/:commentId`, updateComment);

module.exports = router;
