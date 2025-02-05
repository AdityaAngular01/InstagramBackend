const { Schemas, ValidateJoi } = require("../middleware/model.validation");

const {
	getUserInfo,
	deleteAccount,
	updateProile,
	followingList,
	followersList,
	searchUser,
	followUser,
	unfollowUser
} = require("../controller/user.controller");

const router = require("express").Router();

router
	.get("/info", getUserInfo)
	.get("/followings", followingList)
	.get("/followers", followersList)
	.get("/search", ValidateJoi(Schemas.searchUser), searchUser)
	.delete("/delete/account", deleteAccount)
	.put("/update/profile", ValidateJoi(Schemas.updateProfile), updateProile)
	.put("/:userId/follow", followUser)
	.put("/:userId/unfollow", unfollowUser);

module.exports = router;
