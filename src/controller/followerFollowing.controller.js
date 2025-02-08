const FollowerFollowing = require("../model/followerFollowing.model");
const User = require("../model/user.model");
const { internalServerError, notFound } = require("./error.controller");
const httpStatus = require("../util/http.status.codes");

// Follow User
exports.followUser = async (req, res) => {
	try {
		const { _id: followerId } = req.user;
		const { userId: followingId } = req.params;

		const self = await User.findByUserId(followerId);
		if (!self) {
			return notFound(req, res, "User not found");
		}
		const recipient = await User.findByUserId(followingId);
		if (!recipient) {
			return res
				.status(httpStatus.NOT_FOUND.CODE)
				.json({ message: "User not found" });
		}

		const alreadyFollowed = await FollowerFollowing.isFollowing(
			followerId,
			followingId
		);

		if (alreadyFollowed) {
			return res
				.status(409)
				.json({ message: "You are already following this user" });
		}

		const follow = await FollowerFollowing.followUser(
			followerId,
			followingId
		);
		await self.incrementFollowing();
		await recipient.incrementFollowers();

		res.status(200).json({ message: "User followed successfully" });
	} catch (error) {
		return internalServerError(req, res, error);
	}
};

// Unfollow User
exports.unfollowUser = async (req, res) => {
	try {
		const { _id: followerId } = req.user;
		const { userId: followingId } = req.params;

		const self = await User.findByUserId(followerId);
		if (!self) {
			return notFound(req, res, "User not found");
		}
		const recipient = await User.findByUserId(followingId);
		if (!recipient) {
			return notFound(req, res, "User not found");
		}

		await self.decrementFollowing();
		await recipient.decrementFollowers();

		res.status(200).json({ message: "User unfollowed successfully" });
	} catch (error) {
		return internalServerError(req, res, error);
	}
};

//Folling List
exports.followingsList = async (req, res) => {
	try {
		const { _id } = req.user;
		let following = await FollowerFollowing.getFollowingList(_id);
		res.status(200).json(following);
	} catch (error) {
		return internalServerError(req, res, error);
	}
};

//Followers List
exports.followersList = async (req, res) => {
	try {
		const { _id } = req.user;
		let followers = await FollowerFollowing.getFollowersList(_id);

		res.status(200).json(followers);
	} catch (error) {
		return internalServerError(req, res, error);
	}
};

//Followers Count
exports.followersCount = async (req, res) => {
	try {
		const totalFollowers = await FollowerFollowing.getFollowersCount(
			req.user._id
		);
		res.status(200).json({ followerCount: totalFollowers });
	} catch (error) {
		return internalServerError(req, res, error);
	}
};
//Followings Count
exports.followingsCount = async (req, res) => {
	try {
		const totalFollowings = await FollowerFollowing.getFollowingsCount(
			req.user._id
		);
		res.status(200).json({ followingCount: totalFollowings });
	} catch (error) {
		return internalServerError(req, res, error);
	}
};
