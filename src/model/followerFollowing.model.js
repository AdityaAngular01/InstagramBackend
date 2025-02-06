const mongoose = require('mongoose');

const followerFollowingSchema = new mongoose.Schema({
    followerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    followingId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{timestamps: true, versionKey: false});

// Ensure that a user can only follow another user once
followerFollowingSchema.index(
	{ followerId: 1, followingId: 1 },
	{ unique: true }
);

/**
 * @desc Follow User
 */
followerFollowingSchema.statics.followUser = async function (followerId, followingId) {
    return await this.create({ followerId, followingId });
};

/**
 * @desc Unfollow User
 */
followerFollowingSchema.statics.unfollowUser = async function (followerId, followingId) {
    return await this.findOneAndDelete({ followerId, followingId });
};

/**
 * @desc user is following another user
 */
followerFollowingSchema.statics.isFollowing = async function (
	followerId,
	followingId
) {
	return await this.exists({ followerId, followingId });
};

/**
 * @desc Get Followers List
 */
followerFollowingSchema.statics.getFollowersList = async function(userId){
    return await this.find({ followingId: userId }).populate("followerId", "_id username profilePicture");
}

/**
 * @desc Get Following List
 */
followerFollowingSchema.statics.getFollowingList = async function (userId) {
    return await this.find({ followerId: userId }).populate("followingId", "_id username profilePicture");
};

/**
 * @desc Delete Followers
 */
followerFollowingSchema.statics.deleteFollowers = async function (userId) {
	return await this.deleteMany({ followingId: userId });
};

/**
 * @desc Delete Followings
 */
followerFollowingSchema.statics.deleteFollowings = async function (userId) {
	return await this.deleteMany({ followerId: userId });
};

/**
 * @desc Followers Count
 */
followerFollowingSchema.statics.getFollowersCount = async function (userId) {
	return await this.countDocuments({ followingId: userId });
};

/**
 * @desc Following Count
 */
followerFollowingSchema.statics.getFollowingsCount = async function (userId) {
    return await this.countDocuments({ followerId: userId });
};

module.exports = mongoose.model('FollowerFollowing', followerFollowingSchema);