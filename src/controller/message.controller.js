const Message = require('../model/message.model');
const User = require('../model/user.model');

exports.sendMessage = async (req, res) => {
	try {
		const { receiverId, content, mediaUrl, messageType } = req.body;
		const senderId = req.user._id; // Assuming user is authenticated

		if (!receiverId || !content || !messageType) {
			return res
				.status(400)
				.json({
					success: false,
					message: "Receiver, content, and message type are required",
				});
		}

		const newMessage = await Message.sendMessage(
			senderId,
			receiverId,
			content,
			mediaUrl,
			messageType
		);
		res.status(201).json({
			success: true,
			message: "Message sent successfully",
			newMessage,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
exports.getMessagesBetweenUsers = async (req, res) => {
	try {
		const { user2Id } = req.params;
		const user1Id = req.user._id; // Assuming user is authenticated

		const messages = await Message.getMessagesBetweenUsers(
			user1Id,
			user2Id
		);
		res.status(200).json({ success: true, messages });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
exports.getUserConversations = async (req, res) => {
	try {
		const userId = req.user._id; // Assuming user is authenticated

		const conversations = await Message.getUserConversations(userId);
		res.status(200).json({ success: true, conversations });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
exports.deleteMessage = async (req, res) => {
	try {
		const { messageId } = req.params;
		const userId = req.user._id; // Assuming user is authenticated

		const deletedMessage = await Message.deleteMessage(messageId, userId);
		if (!deletedMessage) {
			return res
				.status(400)
				.json({
					success: false,
					message: "Message not found or already deleted",
				});
		}

		res.status(200).json({
			success: true,
			message: "Message deleted successfully",
			deletedMessage,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
exports.markMessageAsRead = async (req, res) => {
	try {
		const { messageId } = req.params;
		const userId = req.user._id; // Assuming user is authenticated

		const updatedMessage = await Message.markMessageAsRead(
			messageId,
			userId
		);
		if (!updatedMessage) {
			return res
				.status(400)
				.json({
					success: false,
					message: "Message not found or already read",
				});
		}

		res.status(200).json({
			success: true,
			message: "Message marked as read",
			updatedMessage,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
exports.deleteChat = async (req, res) => {
	try {
		const { user2Id } = req.params;
		const user1Id = req.user._id; // Assuming user is authenticated

		await Message.deleteChat(user1Id, user2Id);
		res.status(200).json({
			success: true,
			message: "Chat deleted successfully",
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
