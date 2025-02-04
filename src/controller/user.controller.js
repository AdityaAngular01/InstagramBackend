const User = require("../model/user.model");
const httpStatus = require("../util/http.status.codes");

const internalServerError = async (req, res) =>
	res.status(httpStatus.INTERNAL_SERVER_ERROR.CODE).json({
		message: httpStatus.INTERNAL_SERVER_ERROR.MESSAGE,
	});

//Get User Information
exports.getUserInfo = async (req, res) => {
	try {
		const { _id } = req.user;
		const user = await User.findById(_id).select("-password -__v");
		if (!user) {
			return res
				.status(httpStatus.NOT_FOUND.CODE)
				.json({ message: "User not found" });
		}
		const { followers, following, posts, ...updatedUser } = user.toObject();
		updatedUser.followersCount = followers.length;
		updatedUser.followingCount = following.length;
		updatedUser.postsCount = posts.length;
		res.status(200).json(updatedUser);
	} catch (error) {
		return internalServerError(req, res);
	}
};

//Delete User Account
exports.deleteAccount = async (req, res) => {
	try {
		const { _id } = req.user;
		const user = await User.findByIdAndDelete(_id);
		if (!user) {
			return res
				.status(httpStatus.NOT_FOUND.CODE)
				.json({ message: "User not found" });
		}
		res.status(200).json({ message: "User deleted successfully" });
	} catch (error) {
		return internalServerError(req, res);
	}
};

//Update User Profile
exports.updateProile = async (req, res) => {
	try {
		const { _id } = req.user;
        const {fullName='', bio='', profilePicture=''} = req.body;
        let update = {}
        if(fullName){
            update.fullName = fullName
        }
        if(bio){
            update.bio = bio
        }
        if(profilePicture){
            update.profilePicture = profilePicture
        }
        const updatedUser = await User.findByIdAndUpdate(_id, update, {new: true});
        if (!updatedUser){
            return res
               .status(httpStatus.NOT_FOUND.CODE)
               .json({ message: "User not found" });
        }
        res.status(200).json({ message: "User profile updated successfully" });
	} catch (error) {
		return internalServerError(req, res);
	}
};

//Folling List
exports.followingList = async(req, res)=>{
    try {
        const { _id } = req.user;
        const following = await User.findById(_id).select("following -_id").populate('following', "_id username profilePictire");
        if(!following){
            return res
               .status(httpStatus.NOT_FOUND.CODE)
               .json({ message: "User not found" });
        }
        res.status(200).json(following.following);
    } catch (error) {
        return internalServerError(req, res);
    }
}

//Followers List
exports.followersList = async(req, res)=>{
    try {
        const { _id } = req.user;
        const followers = await User.findById(_id).select("followers -_id").populate('followers', "_id username profilePicture");
        if(!followers){
            return res
               .status(httpStatus.NOT_FOUND.CODE)
               .json({ message: "User not found" });
        }
        res.status(200).json(followers.followers);
    } catch (error) {
        return internalServerError(req, res);
    }
}

//Serach User
exports.searchUser = async(req, res)=>{
    try {
        const {username='', fullName=''}= req.body;

        let query = {}

        if(username){
            query.username = new RegExp(username, 'i');
        }

        if(fullName){
            query.fullName = new RegExp(fullName, 'i');
        }

        const users = await User.find(query).select("_id username profilePicture");
        if(!users){
            return res
               .status(httpStatus.NOT_FOUND.CODE)
               .json({ message: "No users found" });
        }
        res.status(200).json(users);
    } catch (error) {
        return internalServerError(req, res);
    }
}

// Follow User
exports.followUser = async(req, res)=>{
    try {
        const { _id: followerId } = req.user;
        const { userId: followingId } = req.params;

        const follower = await User.findByIdAndUpdate(followerId, {$push: {following: followingId}}, {new: true});
        if(!follower){
            return res
               .status(httpStatus.NOT_FOUND.CODE)
               .json({ message: "User not found" });
        }

        const following = await User.findByIdAndUpdate(followingId, {$push: {followers: followerId}}, {new: true});
        if(!following){
            return res
               .status(httpStatus.NOT_FOUND.CODE)
               .json({ message: "User not found" });
        }

        res.status(200).json({ message: "User followed successfully" });
    } catch (error) {
        return internalServerError(req, res);
    }
}

// Unfollow User
exports.unfollowUser = async(req, res)=>{
    try {
        const { _id: followerId } = req.user;
        const { userId: followingId } = req.params;

        const follower = await User.findByIdAndUpdate(followerId, {$pull: {following: followingId}}, {new: true});
        if(!follower){
            return res
               .status(httpStatus.NOT_FOUND.CODE)
               .json({ message: "User not found" });
        }

        const following = await User.findByIdAndUpdate(followingId, {$pull: {followers: followerId}}, {new: true});
        if(!following){
            return res
               .status(httpStatus.NOT_FOUND.CODE)
               .json({ message: "User not found" });
        }

        res.status(200).json({ message: "User unfollowed successfully" });
    } catch (error) {
        return internalServerError(req, res);
    }
}