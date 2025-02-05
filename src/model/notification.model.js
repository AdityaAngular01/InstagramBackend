const mongoose = require('mongoose');

const notificationschema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type:{
        type: String,
        enum: ['FOLLOW', 'LIKE', 'COMMENT', 'MESSAGE', 'MENTION', 'POST', 'OTHER'],
        required: true
    },
    referenceId:{
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'type',
        required: true
    },
    message:{
        type: String,
        required: true,
    },
    isRead:{
        type: Boolean,
        required: false,
        default: false
    }
}, {timestamps: true});

module.exports = mongoose.model('Notification', notificationschema);