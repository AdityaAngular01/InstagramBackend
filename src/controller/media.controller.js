const Media = require("../model/media.model");
const Post = require("../model/post.model");
const cloudinary = require("../util/cloudinary");

exports.uploadMedia = async (req, res) => {
	try {
		const { postId } = req.body;
		const userId = req.user.id;
		const file = req.file; // Assuming you're using Multer for file uploads

		if (!file) {
			return res
				.status(400)
				.json({ success: false, message: "No file uploaded" });
		}

		// Upload file to Cloudinary (optional)
		const result = await cloudinary.uploader.upload(file.path, {
			resource_type: "auto",
		});

		const newMedia = await Media.uploadMedia(
			userId,
			postId,
			result.secure_url,
			file.mimetype.startsWith("video") ? "video" : "image"
		);

		res.status(201).json({
			success: true,
			message: "Media uploaded successfully",
			media: newMedia,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
exports.deleteMedia = async (req, res) => {
	try {
		const { mediaId } = req.params;

		const media = await Media.findById(mediaId);
		if (!media) {
			return res
				.status(404)
				.json({ success: false, message: "Media not found" });
		}

		// Delete from Cloudinary (optional)
		const publicId = media.url.split("/").pop().split(".")[0]; // Extract Cloudinary ID
		await cloudinary.uploader.destroy(publicId);

		await Media.deleteMedia(mediaId);
		res.status(200).json({
			success: true,
			message: "Media deleted successfully",
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
exports.getMediaByPost = async (req, res) => {
	try {
		const { postId } = req.params;
		const media = await Media.getMediaByPost(postId);

		res.status(200).json({ success: true, media });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
exports.getMediaByUser = async (req, res) => {
	try {
		const { userId } = req.params;
		const media = await Media.getMediaByUser(userId);

		res.status(200).json({ success: true, media });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
exports.updateMedia = async (req, res) => {
	try {
		const { mediaId } = req.params;
		const file = req.file; // New file

		if (!file) {
			return res
				.status(400)
				.json({ success: false, message: "No file uploaded" });
		}

		// Upload new file to Cloudinary
		const result = await cloudinary.uploader.upload(file.path, {
			resource_type: "auto",
		});

		// Update media URL
		const updatedMedia = await Media.updateMedia(
			mediaId,
			result.secure_url
		);

		res.status(200).json({
			success: true,
			message: "Media updated successfully",
			media: updatedMedia,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
