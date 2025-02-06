const Notification = require("../model/notification.model");

// Create a new notification
exports.createNotification = async (req, res) => {
	try {
		const { userId, type, referenceId, message } = req.body;

		if (!userId || !type || !referenceId || !message) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}

		const notification = await Notification.createNotification(
			userId,
			type,
			referenceId,
			message
		);
		res.status(201).json({
			success: true,
			message: "Notification created successfully",
			notification,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Get notifications for a user
exports.getNotifications = async (req, res) => {
	try {
		const userId = req.user._id; // Assuming user is authenticated
		const isRead = req.query.isRead || false;

		const notifications = await Notification.getNotifications(
			userId,
			isRead
		);
		res.status(200).json({ success: true, notifications });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
	try {
		const { notificationId } = req.params;

		const updatedNotification = await Notification.markAsRead(
			notificationId
		);
		if (!updatedNotification) {
			return res
				.status(404)
				.json({ success: false, message: "Notification not found" });
		}

		res.status(200).json({
			success: true,
			message: "Notification marked as read",
			updatedNotification,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
	try {
		const { notificationId } = req.params;

		const deletedNotification = await Notification.deleteNotification(
			notificationId
		);
		if (!deletedNotification) {
			return res
				.status(404)
				.json({ success: false, message: "Notification not found" });
		}

		res.status(200).json({
			success: true,
			message: "Notification deleted successfully",
			deletedNotification,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Delete all notifications for a user
exports.deleteAllNotifications = async (req, res) => {
	try {
		const userId = req.user._id; // Assuming user is authenticated

		const result = await Notification.deleteAllNotifications(userId);
		res.status(200).json({
			success: true,
			message: "All notifications deleted successfully",
			result,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
