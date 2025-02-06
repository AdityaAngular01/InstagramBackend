const Hashtag = require("../model/hashtag.model");
const Post = require("../model/post.model");


exports.createHashtag = async (req, res) => {
	try {
		const { name } = req.body;
		if (!name) {
			return res
				.status(400)
				.json({ success: false, message: "Hashtag name is required" });
		}

		const hashtag = await Hashtag.createHashtag(name);
		res.status(201).json({
			success: true,
			message: "Hashtag created/found successfully",
			hashtag,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};


exports.getHashtagByName = async (req, res) => {
	try {
		const { name } = req.params;
		const hashtag = await Hashtag.getHashtagByName(name);

		if (!hashtag) {
			return res
				.status(404)
				.json({ success: false, message: "Hashtag not found" });
		}

		res.status(200).json({ success: true, hashtag });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
exports.addPostToHashtag = async (req, res) => {
	try {
		const { hashtagId, postId } = req.body;

		const post = await Post.findById(postId);
		if (!post) {
			return res
				.status(404)
				.json({ success: false, message: "Post not found" });
		}

		const updatedHashtag = await Hashtag.addPostToHashtag(
			hashtagId,
			postId
		);
		res.status(200).json({
			success: true,
			message: "Post added to hashtag",
			hashtag: updatedHashtag,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
exports.removePostFromHashtag = async (req, res) => {
	try {
		const { hashtagId, postId } = req.body;

		const updatedHashtag = await Hashtag.removePostFromHashtag(
			hashtagId,
			postId
		);
		res.status(200).json({
			success: true,
			message: "Post removed from hashtag",
			hashtag: updatedHashtag,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
exports.getPostsByHashtag = async (req, res) => {
	try {
		const { name } = req.params;
		const posts = await Hashtag.getPostsByHashtag(name);

		res.status(200).json({ success: true, posts });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
exports.deleteHashtag = async (req, res) => {
	try {
		const { hashtagId } = req.params;
		const deletedHashtag = await Hashtag.deleteHashtag(hashtagId);

		if (!deletedHashtag) {
			return res
				.status(400)
				.json({
					success: false,
					message: "Cannot delete hashtag with linked posts",
				});
		}

		res.status(200).json({
			success: true,
			message: "Hashtag deleted successfully",
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
