const User = require("../model/user.model");
const FollowerFollowing = require("../model/followerFollowing.model");
const Post = require("../model/post.model")

const httpStatus = require("../util/http.status.codes");
const {internalServerError, notFound} = require('./error.controller')

//Get User Information
exports.getUserInfo = async (req, res) => {
	try {
		const { _id } = req.user;
		const user = await User.findByUserId(_id);
		if (!user) {
			return notFound(req, res, "User not found");
		}
		const { followers, following, posts, ...updatedUser } = user.toObject();
		updatedUser.followersCount = followers;
		updatedUser.followingCount = following;
		updatedUser.postsCount = posts;
		res.status(200).json(updatedUser);
	} catch (error) {
		return internalServerError(req, res, error);

	}
};

//Delete User Account
exports.deleteAccount = async (req, res) => {
	try {
		const { _id } = req.user;
		const user = await User.findByIdAndDelete({ _id: _id });
        
		if (!user) {
			return notFound(req, res, "User not found");
		}

        //Remove followers and following records
        await FollowerFollowing.deleteFollowers( _id );
        await FollowerFollowing.deleteFollowings( _id );
        await Post.deleteMany({userId: _id})
		res.status(200).json({ message: "User deleted successfully" });
	} catch (error) {        
		return internalServerError(req, res, error);
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
			return notFound(req, res, "User not found");
        }
        res.status(200).json({ message: "User profile updated successfully" });
	} catch (error) {
		return internalServerError(req, res, error);
	}
};

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
			return notFound(req, res, "User not found");
        }
        res.status(200).json(users);
    } catch (error) {
		return internalServerError(req, res, error);

    }
}
