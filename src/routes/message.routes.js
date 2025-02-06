const express = require("express");
const router = express.Router();
const {
	sendMessage,
	getMessagesBetweenUsers,
	getUserConversations,
	deleteMessage,
	deleteChat,
	markMessageAsRead,
} = require("../controller/message.controller");

router
	.post("/", sendMessage)
	.get(
		"/:user2Id",

		getMessagesBetweenUsers
	)
	.get(
		"/conversations",

		getUserConversations
	)
	.delete("/:messageId", deleteMessage)
	.put(
		"/read/:messageId",

		markMessageAsRead
	)
	.delete("/chat/:user2Id", deleteChat);

module.exports = router;
