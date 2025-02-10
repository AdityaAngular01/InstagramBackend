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
	.get("/conversations", getUserConversations)
	.get("/:user2Id", getMessagesBetweenUsers)
	.put("/read/:messageId", markMessageAsRead)
	.delete("/chat/:user2Id", deleteChat)
	.delete("/:messageId", deleteMessage);

module.exports = router;
