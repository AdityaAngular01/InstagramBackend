const mongoose = require("mongoose");

const hashtagSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
	},
	posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }], // Posts using this hashtag
	createdAt: { type: Date, default: Date.now },
});

/**
 * @desc Create or Find a Hashtag
 */
hashtagSchema.statics.createHashtag = async function (name) {
	let hashtag = await this.findOne({ name });
	if (!hashtag) {
		hashtag = await this.create({ name });
	}
	return hashtag;
};

/**
 * @desc Get Hashtag by Name
 */
hashtagSchema.statics.getHashtagByName = async function (name) {
	return this.findOne({ name }).populate("posts");
};

/**
 * @desc Add Post to Hashtag
 */
hashtagSchema.statics.addPostToHashtag = async function (hashtagId, postId) {
	return this.findByIdAndUpdate(
		hashtagId,
		{ $addToSet: { posts: postId } }, // Prevent duplicate post entries
		{ new: true }
	);
};

/**
 * @desc Remove Post from Hashtag
 */
hashtagSchema.statics.removePostFromHashtag = async function (
	hashtagId,
	postId
) {
	return this.findByIdAndUpdate(
		hashtagId,
		{ $pull: { posts: postId } }, // Remove post from hashtag
		{ new: true }
	);
};

/**
 * @desc Get Posts by Hashtag
 */
hashtagSchema.statics.getPostsByHashtag = async function (name) {
	const hashtag = await this.findOne({ name }).populate("posts");
	return hashtag ? hashtag.posts : [];
};

/**
 * @desc Delete Hashtag (if no posts are linked)
 */
hashtagSchema.statics.deleteHashtag = async function (hashtagId) {
	const hashtag = await this.findById(hashtagId);
	if (hashtag && hashtag.posts.length === 0) {
		return this.findByIdAndDelete(hashtagId);
	}
	return null; // Prevent deletion if posts are still linked
};

module.exports = mongoose.model("Hashtag", hashtagSchema);
