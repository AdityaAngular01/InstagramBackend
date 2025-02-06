const multer = require("multer");
const path = require("path");

// Set storage engine
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "instagram/");
	},
	filename: function (req, file, cb) {
		cb(
			null,
			file.fieldname + "-" + Date.now() + path.extname(file.originalname)
		);
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

// Multer upload settings
const upload = multer({
	storage,
	limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
	fileFilter,
});

module.exports = upload;
