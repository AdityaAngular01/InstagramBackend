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
	.post("/upload", upload.single("file"), uploadMedia)
	.delete("/:mediaId", deleteMedia)
	.get("/post/:postId", getMediaByPost)
	.get("/user/:userId", getMediaByUser)
	.put("/:mediaId", upload.single("file"), updateMedia);

module.exports = router;
