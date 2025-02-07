const Comment = require("../model/comment.model");
const Post = require("../model/post.model");
const { notFound, internalServerError } = require("./error.controller");
const httpUtil = require("../util/http.status.codes");
const { response } = require("express");

// Comment on a Post
exports.commentOnPost = async (req, res) => {
	try {
		const { postId } = req.params;
		const { text } = req.body;
		const userId = req.user._id;

		const post = await Post.findById(postId);
		if (!post) {
			return notFound(req, res, httpUtil.NOT_FOUND.MESSAGE.POST);
		}

		const comment = await Comment.createComment(userId, postId, text);

		await post.incrementComments();

		res.status(201).json({ success: true, comment });
	} catch (error) {
		return internalServerError(req, res, error);
	}
};

// Delete a Comment
exports.deleteComment = async (req, res) => {
	try {
		const { postId, commentId } = req.params;

		const post = await Post.findOne({ _id: postId });
		
		
		if (!post) {
			return notFound(req, res, httpUtil.NOT_FOUND.MESSAGE.POST);
		}
		const comment = await Comment.deleteComment(commentId, req.user._id);
		if (!comment)
			return notFound(req, res, httpUtil.NOT_FOUND.MESSAGE.COMMENT);

		await post.decrementComments();

		res.status(200).json({ success: true, message: "Comment deleted" });
	} catch (error) {
		return internalServerError(req, res, error);
	}
};

//Get All Comments of a Post
exports.getCommentsForPost = async (req, res) => {
	try {
		const { postId } = req.params;
		const comments = await Comment.getCommentsByPost(postId);

		res.status(200).json({ success: true, comments });
	} catch (error) {
		return internalServerError(req, res, error);
	}
};

// Get Comments Counts
exports.getCommentsCount = async (req, res) => {
	try {
		const { postId } = req.params;
		const totalComments = await Comment.getCommentsCount(postId);
		res.status(200).json({ success: true, totalComments });
	} catch (error) {
		return internalServerError(req, res, error);
	}
};

//Update Comment
exports.updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;
        const { text } = req.body;

        const comment = await Comment.getCommentByIdAndUserId(commentId, userId);

        if (!comment)
            return notFound(req, res, httpUtil.NOT_FOUND.MESSAGE.COMMENT);
		
        comment.text = text;
		await comment.save();

        res.status(200).json({ success: true, comment });
    } catch (error) {
        return internalServerError(req, res, error);
    }
};
