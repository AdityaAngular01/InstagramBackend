const { required } = require('joi');
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	imageUrl: {
		type: String,
		required: true,
	},
	caption: {
		type: String,
		maxlength: 2200,
	},
    likesCount:{
        type: Number,
        default: 0
    },
    commentsCount:{
        type: Number,
        default: 0
    },
}, {timestamps: true});

/** 
 * @desc Create a new post
 */
postSchema.statics.createPost = async function (userId, imageUrl, caption) {
	const newPost = new this({
		userId: userId,
		imageUrl: imageUrl,
		caption: caption,
	});
	return await newPost.save();
};

/** 
 * @desc Get a post by ID
 */
postSchema.statics.getPostById = async function(postId){
	return await this.findById(postId).populate("userId", "username profilePicture");
}

/** 
 * @desc Get all posts of a user
 */
postSchema.statics.getPostsByUser = async function (userId) {
	return await this.find({ userId: userId }).sort({ createdAt: -1 });
};

/** 
 * @desc Delete a post by ID
 */
postSchema.statics.deletePostById = async function (postId, userId) {
    return await this.findOneAndDelete({_id: postId, userId:userId})
};

/** 
 * @desc Increase like count
 */
postSchema.methods.incrementLikes = async function () {
	this.likesCount += 1;
	await this.save();
};

/** 
 * @desc Decrease like count
 */
postSchema.methods.decrementLikes = async function () {
	if (this.likesCount > 0) {
		this.likesCount -= 1;
		await this.save();
	}
};

/** 
 * @desc Increase comment count
 */
postSchema.methods.incrementComments = async function () {
	this.commentsCount += 1;
	await this.save();
};

/** 
 * @desc Decrease comment count
 */
postSchema.methods.decrementComments = async function () {
	if (this.commentsCount > 0) {
		this.commentsCount -= 1;
		await this.save();
	}
};

module.exports = mongoose.model('Post', postSchema);