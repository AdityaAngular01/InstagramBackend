const Media = require("../model/media.model");
const Post = require("../model/post.model");
const cloudinary = require("../util/cloudinary");


//Upload Media
exports.uploadMedia = async (req, res) => {
	try {
		const { postId } = req.body;
		const userId = req.user._id;
		const file = req.file;

		if (!file) {
			return res
				.status(400)
				.json({ success: false, message: "No file uploaded" });
		}

		console.log(file);
		const newMedia = await Media.uploadMedia(
			userId,
			postId,
			file.path,
			file.mimetype.startsWith("video") ? "video" : "image",
			file.filename
		);
		

		res.status(201).json({
			success: true,
			message: "Media uploaded successfully",
			media: newMedia,
		});
	} catch (error) {
		console.log(error);
		
		res.status(500).json({ success: false, message: error });
	}
};

//Delete Media from Db and Cloudinary Storage
exports.deleteMedia = async (req, res) => {
	try {
		const { mediaId } = req.params;
		const media = await Media.findById(mediaId);

		if (!media) {
			return res.status(404).json({
				success: false,
				message: "Media not found",
			});
		}

		// Determine resource type (default to "video")
		const resourceType = media.url.includes("/video/") ? "video" : "image";

		// Attempt deletion
		const response = await cloudinary.uploader.destroy(media.publicId, {
			resource_type: resourceType,
		});

		// Check if Cloudinary actually deleted the file
		if (response.result !== "ok") {
			return res.status(400).json({
				success: false,
				message: "Failed to delete media from Cloudinary",
				cloudinary_response: response,
			});
		}
		// Delete from database
		await Media.deleteMedia(mediaId);
		res.status(200).json({
			success: true,
			message: "Media deleted successfully",
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};


// Get Media by Post
exports.getMediaByPost = async (req, res) => {
	try {
		const { postId } = req.params;
		const media = await Media.getMediaByPost(postId);

		res.status(200).json({ success: true, media });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Get Media by User
exports.getMediaByUser = async (req, res) => {
	try {
		const { userId } = req.params;
		const media = await Media.getMediaByUser(userId);

		res.status(200).json({ success: true, media });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Update Media
exports.updateMedia = async (req, res) => {
	try {
		const { mediaId } = req.params;
		const file = req.file; // New file

		if (!file) {
			return res
				.status(400)
				.json({ success: false, message: "No file uploaded" });
		}

		// Update media URL
		const updatedMedia = await Media.updateMedia(mediaId, file.path, file.mimetype.startsWith("video") ? "video" : "image", file.filename);

		res.status(200).json({
			success: true,
			message: "Media updated successfully",
			media: updatedMedia,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
