const express = require("express");
const router = express.Router();
const {
	createNotification,
	getNotifications,
	markAsRead,
	deleteNotification,
	deleteAllNotifications,
} = require("../controller/notification.controller");

router
	.post("/", createNotification)
	.get("/", getNotifications)
	.put(
		"/:notificationId",
		markAsRead
	)
	.delete(
		"/:notificationId",
		deleteNotification
	)
	.delete(
		"/all",
		deleteAllNotifications
	);

module.exports = router;
