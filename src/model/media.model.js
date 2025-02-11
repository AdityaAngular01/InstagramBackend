const { required } = require("joi");
const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
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
	url: { type: String, required: true },
	type: { type: String, enum: ["image", "video"], required: true },
	createdAt: { type: Date, default: Date.now },
	publicId: {type:String, required: true}
});

/**
 * @desc Upload media (image/video)
 */
mediaSchema.statics.uploadMedia = async function (
	userId,
	postId,
	url,
	type,
	publicId
) {
	return this.create({
		userId: userId,
		postId: postId,
		url: url,
		type: type,
		publicId: publicId
	});
};

/**
 * @desc Delete media
 */
mediaSchema.statics.deleteMedia = async function (mediaId) {
	return this.findByIdAndDelete(mediaId);
};

/**
 * @desc Get media by post
 */
mediaSchema.statics.getMediaByPost = async function (postId) {
	return this.find({ postId: postId }).sort({ createdAt: -1 });
};

/**
 * @desc Get media by user
 */
mediaSchema.statics.getMediaByUser = async function (userId) {
	return this.find({ userId: userId }).sort({ createdAt: -1 });
};

/**
 * @desc Update media (if replacing an image/video)
 */
mediaSchema.statics.updateMedia = async function (mediaId, newUrl,type, publicId) {
	return this.findByIdAndUpdate(
		mediaId,
		{ url: newUrl, publicId: publicId, type: type },
		{ new: true }
	);
};

module.exports = mongoose.model("Media", mediaSchema);
