const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type:{
        type: String,
        enum: ['IMAGE', 'VIDEO'],
        required: true
    },
    url:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: false,
        maxlength: 2200
    }
}, {timestamps: true});

module.exports = mongoose.model('Media', mediaSchema);