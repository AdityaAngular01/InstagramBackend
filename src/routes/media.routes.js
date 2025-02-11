const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");

const {
	uploadMedia,
	deleteMedia,
	getMediaByPost,
	getMediaByUser,
	updateMedia,
} = require("../controller/media.controller");

router
	.get("/post/:postId", getMediaByPost)
	.get("/user/:userId", getMediaByUser)
	.post("/upload", upload.single("file"), uploadMedia)
	.delete("/:mediaId", deleteMedia)
	.put("/:mediaId", upload.single("file"), updateMedia);

module.exports = router;
