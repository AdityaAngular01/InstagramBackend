const Like = require('../model/like.model');
const Post = require('../model/post.model');

// Like a Post
exports.likePost = async (req, res) => {
	try {
		const { postId } = req.params;
		const userId = req.user._id;
		const post = await Post.findById(postId);

		if (!post)
			return res
				.status(404)
				.json({ success: false, message: "Post not found" });

		const alreadyLiked = await Like.hasLiked(userId, postId);
		if (alreadyLiked) {
			return res
				.status(400)
				.json({ success: false, message: "Post already liked" });
		}

		await Like.likePost(userId, postId);
		await post.incrementLikes();
		res.status(200).json({ success: true, message: "Post liked" });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Unlike a Post
exports.unlikePost = async (req, res) => {
	try {
		const { postId } = req.params;

		const userId = req.user._id;

		const post = await Post.findById(postId);

		if (!post)
			return res
				.status(404)
				.json({ success: false, message: "Post not found" });

		const like = await Like.unlikePost(userId, postId);

		if (!like) {
			return res
				.status(400)
				.json({ success: false, message: "Like not found" });
		}

		await post.decrementLikes();

		res.status(200).json({ success: true, message: "Post unliked" });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};


// Get Total Likes for a Post
exports.getLikesCount = async (req, res) => {
	try {
		const { postId } = req.params;

		const likesCount = await Like.getLikesCount(postId);

		res.status(200).json({ success: true, likesCount });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};