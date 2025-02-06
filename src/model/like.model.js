const mongoose = require("mongoose");
const { Schema } = mongoose;

const likeSchema = new Schema(
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
	},
	{ timestamps: true }
);

// Index to prevent duplicate likes
likeSchema.index({ userId: 1, postId: 1 }, { unique: true });

/**
 * @desc Like a post
 */
likeSchema.statics.likePost = async function (userId, postId) {
	return await this.create({ userId: userId, postId: postId });
};

/**
 * @desc Unlike a post
 */
likeSchema.statics.unlikePost = async function (userId, postId) {
	return await this.findOneAndDelete({ userId, postId });
};

/**
 * @desc Check if a user has liked a post
 */
likeSchema.statics.hasLiked = async function (userId, postId) {
	return await this.exists({ userId, postId });
};

/**
 * @desc Get total likes for a post
 */
likeSchema.statics.getLikesCount = async function (postId) {
	return await this.countDocuments({ postId });
};

module.exports = mongoose.model("Like", likeSchema);
