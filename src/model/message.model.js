const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text:{
        type: String,
        required: true,
        maxlength: 1000
    },
    media:{
        type: String, // URL of the media file
        required: false
    },
    messageType:{
        type: String,
        enum: ['TEXT', 'IMAGE', 'VIDEO', 'AUDIO'],
        required: true,
        default: 'TEXT'
    },
    isRead:{
        type: Boolean,
        required: false,
        default: false
    }
}, {timestamps: true});

module.exports = mongoose.model('Message', messageSchema);