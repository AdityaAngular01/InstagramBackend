const Post = require('../model/post.model');
const User = require('../model/user.model');
const Comment = require('../model/comment.model');
const Like = require('../model/like.model');
const {internalServerError, notFound} = require('./error.controller');
const httpUtil = require("../util/http.status.codes");

//Create Post
exports.createPost = async(req, res)=>{
    try {
        
        const {_id} = req.user;
        const {imageUrl, caption} = req.body;
        
        const newPost = await Post.createPost(_id, imageUrl, caption);
        
        const user = await User.findByUserId(_id);
        await user.incrementPosts();
        return res.status(httpUtil.CREATED.CODE).json({ message: "Post Created" });
    } catch (error) {

        //console.log(error);
        
        return internalServerError(req, res, error);
    }
}

//Get All Posts
exports.getAllPosts = async(req, res)=>{
    try {
        const posts = await Post.find().populate(
			"userId",
			"username profilePicture"
		);
        return res.status(httpUtil.OK.CODE).json({success: true, posts});
    } catch (error) {
        return internalServerError(req, res, error);        
    }
}

//Get Single Post By Id
exports.getPostById = async(req, res)=>{
    try {
        const {postId} = req.params;
        const post = await Post.getPostById(postId);
        if(!post) return notFound(httpUtil.NOT_FOUND.MESSAGE.POST);
        return res.status(httpUtil.OK.CODE).json({success: true, post});
    } catch (error) {
        return internalServerError(req, res, error);       
    }
}

// Get Posts by User
exports.getPostsByUser = async(req, res)=>{
    try {
        const {userId} = req.params;
        const posts = await Post.getPostsByUser(userId);
        return res.status(httpUtil.OK.CODE).json({success: true, posts});
    } catch (error) {
        return internalServerError(req, res, error);              
    }
}

// Delete a Post
exports.deletePost = async(req, res)=>{
    try {
		const { postId } = req.params;
		const userId = req.user._id;
		await Comment.deleteMany({ postId: postId });

		await Like.deleteMany({ postId: postId });

		const deletedPost = await Post.deletePostById(postId, userId);
        //console.log(deletedPost);
        
		if (!deletedPost) return notFound(req, res, httpUtil.NOT_FOUND.MESSAGE.POST);

		const user = await User.findByUserId(userId);
		await user.decrementPosts();
    
		res.status(httpUtil.OK.CODE).json({
			message: "Post deleted successfully",
		});
	} catch (error) {
       
        return internalServerError(req, res, error);          
    }
}
