const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../util/cloudinary");

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: async (req, file) => {
		return {
			folder: "instagram_uploads",
			resource_type: file.mimetype.startsWith("video")
				? "video"
				: "image", // Fix for videos
			public_id: file.fieldname + "-" + Date.now(),
		};
	},
});

// File type validation
const fileFilter = (req, file, cb) => {
	const allowedTypes = [
		"image/jpg",
		"image/jpeg",
		"image/png",
		"image/gif",
		"video/mp4",
		"video/mov",
	];

	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error("Invalid file type. Only images and videos are allowed."));
	}
};

// Multer upload settings (Cloudinary)
const upload = multer({
	storage,
	limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
	fileFilter,
});

module.exports = upload;
