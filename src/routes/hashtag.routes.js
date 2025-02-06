const express = require("express");
const router = express.Router();
const {
	createHashtag,
	getHashtagByName,
	addPostToHashtag,
	removePostFromHashtag,
	getPostsByHashtag,
	deleteHashtag,
} = require("../controller/hashtag.controller");

router
	.post("/", createHashtag)
	.get("/:name", getHashtagByName)
	.post("/addPost", addPostToHashtag)
	.post(
		"/removePost",
		removePostFromHashtag
	)
	.get("/posts/:name", getPostsByHashtag)
	.delete("/:hashtagId", deleteHashtag);

module.exports = router;
