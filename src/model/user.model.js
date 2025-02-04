const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type:String, required:true},
    fullName: {type:String, required:true},
    profilePicture: {type:String, required:false},
    bio: {type: String, required: false, min: 5, max: 30},
    followers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    following: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
    isActive: {type: Boolean, required: false}
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);