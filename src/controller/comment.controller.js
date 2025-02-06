const Comment = require('../model/comment.model');
const Post = require('../model/post.model');

// Comment on a Post
exports.commentOnPost = async (req, res) => {
	try {
		const { postId } = req.params;
		const { text } = req.body;
		const userId = req.user._id;

		const comment = await Comment.createComment(userId, postId, text);

		const post = await Post.findById(postId);

		await post.incrementComments();

		res.status(201).json({ success: true, comment });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Delete a Comment
exports.deleteComment = async (req, res) => {
	try {
		const { postId, commentId } = req.params;
		const userId = req.user._id;

		const comment = await Comment.deleteComment(commentId, userId);
		if (!comment)
			return res
				.status(404)
				.json({
					success: false,
					message: "Comment not found or unauthorized",
				});

		const post = await Post.findById(postId);
		await post.decrementComments();

		res.status(200).json({ success: true, message: "Comment deleted" });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

//Get All Comments of a Post
exports.getCommentsForPost = async (req, res) => {
	try {
		const { postId } = req.params;
		const comments = await Comment.getCommentsByPost(postId);

		res.status(200).json({ success: true, comments });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Get Comments Counts
exports.getCommentsCount = async (req, res) => {
	try {
		const {postId} = req.params;
		const totalComments = await Comment.getCommentsCount(postId);
		res.status(200).json({ success: true, totalComments });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
}