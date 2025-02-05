const { required } = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		fullName: { type: String, required: true },
		profilePicture: { type: String, required: false },
		bio: { type: String, required: false, min: 5, max: 30 },
		followers: { type: Number, required: false, default: 0 },
		following: { type: Number, required: false, default: 0 },
		posts: { type: Number, required: false, default: 0 },
		isActive: { type: Boolean, required: false },
	},
	{ timestamps: true }
);

/**
 * @desc User by username
 */
userSchema.statics.findByUserId = async function(userId){
    return await this.findById({ _id: userId }).select("-password -__v");
}
/**
 * @desc User by username
 */
userSchema.statics.findByUsername = async function(username){
    return await this.findOne({ username: username });
}

/**
 * @desc User by email
 */
userSchema.statics.findByEmailId = async function(emailId){
    return await this.findOne({ email: emailId });
}

/**
 * @desc Increase followers count
 */
userSchema.methods.incrementFollowers = async function(){
    this.followers += 1;
    await this.save();
}

/**
 * @desc Decrease followers count
 */
userSchema.methods.decrementFollowers = async function(){
    if(this.followers > 0){
        this.followers -= 1;
        await this.save();
    }
}

/**
 * @desc Increase following count
 */
userSchema.methods.incrementFollowing = async function(){
    this.following += 1;
    await this.save();
}

/**
 * @desc Decrease following count
 */
userSchema.methods.decrementFollowing = async function(){
    if(this.following > 0){
        this.following -= 1;
        await this.save();
    }
}

/**
 * @desc Increase posts count
 */
userSchema.methods.incrementPosts = async function(){
    this.posts += 1;
    await this.save();
}

/**
 * @desc Decrease posts count
 */
userSchema.methods.decrementPosts = async function(){
    if(this.posts > 0){
        this.posts -= 1;
        await this.save();
    }
}

/**
 * @desc Set User as Active
 */
userSchema.methods.setActive = async function(){
    this.isActive = true;
    await this.save();
}

/**
 * @desc Set User as Inactive
 */
userSchema.methods.setInactive = async function(){
    this.isActive = false;
    await this.save();
}

/**
 * @desc Delete User
 */
userSchema.statics.findByUserId = async function(userId){
    return await this.findById({ _id: userId }).select("-password -__v");
}

module.exports = mongoose.model('User', userSchema);