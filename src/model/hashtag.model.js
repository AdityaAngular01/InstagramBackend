const mongoose = require('mongoose');

const hashtagSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    postsCount:{
        type: Number,
        default: 0
    }
},{timestamps: true});

module.exports = mongoose.model('Hashtag', hashtagSchema);