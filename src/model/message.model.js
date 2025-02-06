const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	receiver: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	content: { type: String, trim: true },
	mediaUrl: { type: String }, // For image/video messages
	isRead: { type: Boolean, default: false },
	deletedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Soft delete
	messageType: {
		type: String,
		enum: ["TEXT", "IMAGE", "VIDEO", "AUDIO"],
		required: true,
		default: "TEXT",
	},
	createdAt: { type: Date, default: Date.now },
});

/**
 * @desc Send a new message
 */
messageSchema.statics.sendMessage = async function (
	senderId,
	receiverId,
	content,
	mediaUrl,
	messageType
) {
	const message = await this.create({
		sender: senderId,
		receiver: receiverId,
		content,
		mediaUrl,
		messageType,
	});
	return message;
};

/**
 * @desc Get chat history between two users
 */
messageSchema.statics.getMessagesBetweenUsers = async function (
	user1Id,
	user2Id
) {
	return this.find({
		sender: { $in: [user1Id, user2Id] },
		receiver: { $in: [user1Id, user2Id] },
		deletedBy: { $ne: user1Id }, // Exclude deleted messages
	}).sort({ createdAt: 1 });
};

/**
 * @desc Get all conversations for a user
 */
messageSchema.statics.getUserConversations = async function (userId) {
	return this.aggregate([
		{ $match: { $or: [{ sender: userId }, { receiver: userId }] } },
		{
			$group: {
				_id: {
					$cond: [
						{ $eq: ["$sender", userId] },
						"$receiver",
						"$sender",
					],
				},
				lastMessage: { $last: "$$ROOT" },
			},
		},
		{ $sort: { "lastMessage.createdAt": -1 } },
	]);
};

/**
 * @desc Delete a message (Soft delete: only for sender)
 */
messageSchema.statics.deleteMessage = async function (messageId, userId) {
	return this.findByIdAndUpdate(
		messageId,
		{ $addToSet: { deletedBy: userId } },
		{ new: true }
	);
};

/**
 * @desc Mark message as read
 */
messageSchema.statics.markMessageAsRead = async function (messageId, userId) {
	return this.findOneAndUpdate(
		{ _id: messageId, receiver: userId },
		{ isRead: true },
		{ new: true }
	);
};

/**
 * @desc Delete an entire chat (Soft delete for both users)
 */
messageSchema.statics.deleteChat = async function (user1Id, user2Id) {
	return this.updateMany(
		{
			sender: { $in: [user1Id, user2Id] },
			receiver: { $in: [user1Id, user2Id] },
		},
		{ $addToSet: { deletedBy: user1Id } }
	);
};

module.exports = mongoose.model("Message", messageSchema);
