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
        await User.findByUserId(_id).incrementPosts();
        return res.status(httpUtil.CREATED.CODE).json({ message: "Post Created" });
    } catch (error) {
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
        const {postId} = req.params;
        const userId = req.user._id;
        const deletedPost = await Post.deletePostById(postId, userId);
        if(!deletedPost) return notFound(httpUtil.NOT_FOUND.MESSAGE.POST);
        await Comment.deleteMany({ postId: postId });
        await User.findByUserId(userId).decrementPosts();
        return res.status(httpUtil.OK.CODE).json({ message: "Post deleted successfully" });
    } catch (error) {
        return internalServerError(req, res, error);          
    }
}

// Like a Post
exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(postId);

    
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const alreadyLiked = await Like.hasLiked(userId, postId);
    if (alreadyLiked) {
      return res.status(400).json({ success: false, message: 'Post already liked' });
    }

    await Like.likePost(userId, postId);
    await post.incrementLikes();
    res.status(200).json({ success: true, message: 'Post liked' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Unlike a Post
exports.unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    
    const userId = req.user._id;
    
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    
    const like = await Like.unlikePost(userId, postId);

    if (!like) {
      return res.status(400).json({ success: false, message: 'Like not found' });
    }

    await post.decrementLikes();
    
    res.status(200).json({ success: true, message: 'Post unliked' });
  } catch (error) {
    
    res.status(500).json({ success: false, message: error.message });
  }
};

// Comment on a Post
exports.commentOnPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    const comment = await Comment.createComment(userId, postId, text);

    const post = await Post.findById(postId);
    
    await post.incrementComments();

    res.status(201).json({ success: true, comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a Comment
exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.deleteComment(commentId, userId);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found or unauthorized' });

    const post = await Post.findById(postId);
    await post.decrementComments();

    res.status(200).json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Get All Comments of a Post
exports.getCommentsForPost = async (req, res) => {
	try {
		const { postId } = req.params;
		const comments = await Comment.getCommentsByPost(postId);

		res.status(200).json({ success: true, comments });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
