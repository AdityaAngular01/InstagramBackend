const router = require("express").Router();
const {
	followUser,
	unfollowUser,
	followersList,
	followingsList,
	followersCount,
	followingsCount,
} = require("../controller/followerFollowing.controller");

router
	.post("/:userId", followUser)
	.delete("/:userId", unfollowUser)
	.get("/followers", followersList)
	.get("/following", followingsList)
	.get("/followers/count", followersCount)
	.get("/following/count", followingsCount);

module.exports = router;
