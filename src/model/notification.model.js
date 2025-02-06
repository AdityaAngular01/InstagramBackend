const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		type: {
			type: String,
			enum: [
				"FOLLOW",
				"LIKE",
				"COMMENT",
				"MESSAGE",
				"MENTION",
				"POST",
				"OTHER",
			],
			required: true,
		},
		referenceId: {
			type: mongoose.Schema.Types.ObjectId,
			refPath: "type",
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		isRead: {
			type: Boolean,
			required: false,
			default: false,
		},
	},
	{ timestamps: true }
);

/**
 * @desc Create a new notification
 */
notificationSchema.statics.createNotification = async function (
	userId,
	type,
	referenceId,
	message
) {
	try {
		const notification = await this.create({
			userId,
			type,
			referenceId,
			message,
		});
		return notification;
	} catch (error) {
		throw new Error("Error creating notification: " + error.message);
	}
};

/**
 * @desc Get a notification
 */
notificationSchema.statics.getNotifications = async function (
	userId,
	isRead = false
) {
	try {
		const notifications = await this.find({ userId, isRead }).sort({
			createdAt: -1,
		});
		return notifications;
	} catch (error) {
		throw new Error("Error fetching notifications: " + error.message);
	}
};

/**
 * @desc Mark a notification as read
 */
notificationSchema.statics.markAsRead = async function (notificationId) {
	try {
		const updatedNotification = await this.findByIdAndUpdate(
			notificationId,
			{ isRead: true },
			{ new: true }
		);
		return updatedNotification;
	} catch (error) {
		throw new Error("Error marking notification as read: " + error.message);
	}
};

/**
 * @desc Delete a notification
 */
notificationSchema.statics.deleteNotification = async function (
	notificationId
) {
	try {
		const deletedNotification = await this.findByIdAndDelete(
			notificationId
		);
		return deletedNotification;
	} catch (error) {
		throw new Error("Error deleting notification: " + error.message);
	}
};

/**
 * @desc Delete all notifications of user
 */
notificationSchema.statics.deleteAllNotifications = async function (userId) {
	try {
		const result = await this.deleteMany({ userId: userId });
		return result;
	} catch (error) {
		throw new Error("Error deleting notifications: " + error.message);
	}
};

module.exports = mongoose.model("Notification", notificationSchema);
