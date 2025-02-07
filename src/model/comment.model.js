const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		postId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
			required: true,
		},
		text: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{ timestamps: true }
);

/**
 * @desc Create a new comment
 */
commentSchema.statics.createComment = async function (userId, postId, text) {
	return await this.create({ userId: userId, postId: postId, text: text });
};

/**
 * @desc Delete a comment
 */
commentSchema.statics.deleteComment = async function (commentId, userId) {
	return await this.findOneAndDelete({ _id: commentId, userId: userId });
};

/**
 * @desc Get all comments for a post
 */
commentSchema.statics.getCommentsByPost = async function (postId) {
	return await this.find({ postId: postId })
		.populate("userId", "username profilePicture")
		.sort({ createdAt: -1 });
};

/**
 * @desc Get total comments count for a post
 */
commentSchema.statics.getCommentsCount = async function (postId) {
	return await this.countDocuments({ postId: postId });
};

/**
 * @desc Get Comment By Id and UserId
 */
commentSchema.statics.getCommentByIdAndUserId = async function (commentId, userId) {
    return await this.findOne({ _id: commentId, userId: userId });
};

module.exports = mongoose.model("Comment", commentSchema);

