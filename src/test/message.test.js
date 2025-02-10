const request = require("supertest");
const {
	app,
	invalidIds,
	connectMongoDb,
	disconnectMongoDb,
	getToken,
	getUserID,
	deleteTestAccount,
	authData,
} = require("./util");

let server;
const messageAuthUsersData = authData;
const messageAuth = {
	user1: {
		_id: "",
		token: "",
		messageId: "",
	},
	user2: {
		_id: "",
		token: "",
		messageId: "",
	},
};
beforeAll(async () => {
	server = await connectMongoDb();
	//User 1
	messageAuth.user1.token = await getToken(messageAuthUsersData.user1);
	messageAuth.user1._id = await getUserID(messageAuth.user1.token);

	//User 2
	messageAuth.user2.token = await getToken(messageAuthUsersData.user2);
	messageAuth.user2._id = await getUserID(messageAuth.user2.token);
});

afterAll(async () => {
	await deleteTestAccount(messageAuth.user1.token);
	await deleteTestAccount(messageAuth.user2.token);
	await disconnectMongoDb(server);
});

describe("sending Messages Test Cases", () => {
	it("User 1 => User 2", async () => {
		const response = await request(app)
			.post("/message")
			.send({
				receiverId: messageAuth.user2._id,
				content: "Hello User 2",
				messageType: "TEXT",
			})
			.set("Authorization", `Bearer ${messageAuth.user1.token}`);

		expect(response.status).toBe(201);
		expect(response.body.success).toBe(true);
		expect(response.body.message).toBe("Message sent successfully");
		messageAuth.user1.messageId = response.body.newMessage._id;
	});

	it("User 2 => User 1", async () => {
		const response = await request(app)
			.post("/message")
			.send({
				receiverId: messageAuth.user1._id,
				content: "Hello User 1",
				messageType: "TEXT",
			})
			.set("Authorization", `Bearer ${messageAuth.user2.token}`);

		expect(response.status).toBe(201);
		expect(response.body.success).toBe(true);
		expect(response.body.message).toBe("Message sent successfully");
		messageAuth.user2.messageId = response.body.newMessage._id;
	});
});

describe("Valid Conversations", () => {
	it("User1 Conversations", async () => {
		const response = await request(app)
			.get("/message/conversations")
			.set("Authorization", `Bearer ${messageAuth.user1.token}`);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("success", true);
	});
	it("User2 Conversations", async () => {
		const response = await request(app)
			.get("/message/conversations")
			.set("Authorization", `Bearer ${messageAuth.user2.token}`);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("success", true);
	});
});

describe("Valid Messages Between Users", () => {
	it("User 1 <==> User2", async () => {
		const response = await request(app)
			.get(`/message/${messageAuth.user2._id}`)
			.set("Authorization", `Bearer ${messageAuth.user1.token}`);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("success", true);
		expect(response.body).toHaveProperty("messages");
	});

	it("User 2 <==> User1", async () => {
		const response = await request(app)
			.get(`/message/${messageAuth.user1._id}`)
			.set("Authorization", `Bearer ${messageAuth.user2.token}`);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("success", true);
		expect(response.body).toHaveProperty("messages");
	});
});

describe("Valid Mark as Read Messages", () => {
	it("User 1", async () => {
		const response = await request(app)
			.put(`/message/read/${messageAuth.user2.messageId}`)
			.set("Authorization", `Bearer ${messageAuth.user1.token}`);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("success", true);
		expect(response.body).toHaveProperty(
			"message",
			"Message marked as read"
		);
		expect(response.body).toHaveProperty("updatedMessage");
	});

	it("User 2", async () => {
		const response = await request(app)
			.put(`/message/read/${messageAuth.user1.messageId}`)
			.set("Authorization", `Bearer ${messageAuth.user2.token}`);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("success", true);
		expect(response.body).toHaveProperty(
			"message",
			"Message marked as read"
		);
		expect(response.body).toHaveProperty("updatedMessage");
	});
});

describe("Valid Already Mark as Read Messages", () => {
	it("User 1", async () => {
		const response = await request(app)
			.put(`/message/read/${invalidIds.messageId}`)
			.set("Authorization", `Bearer ${messageAuth.user1.token}`);
		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty("success", false);
		expect(response.body).toHaveProperty(
			"message",
			"Message not found or already read"
		);
	});

	it("User 2", async () => {
		const response = await request(app)
			.put(`/message/read/${invalidIds.messageId}`)
			.set("Authorization", `Bearer ${messageAuth.user2.token}`);
		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty("success", false);
		expect(response.body).toHaveProperty(
			"message",
			"Message not found or already read"
		);
	});
});

describe("Valid Delete Messages", () => {
	it("Delete Message By user1", async () => {
		const response = await request(app)
			.delete(`/message/${messageAuth.user1.messageId}`)
			.set("Authorization", `Bearer ${messageAuth.user1.token}`);

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("success", true);
		expect(response.body).toHaveProperty(
			"message",
			"Message deleted successfully"
		);
		expect(response.body).toHaveProperty("deletedMessage");
	});

	it("Delete Message By user2", async () => {
		const response = await request(app)
			.delete(`/message/${messageAuth.user2.messageId}`)
			.set("Authorization", `Bearer ${messageAuth.user2.token}`);

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("success", true);
		expect(response.body).toHaveProperty(
			"message",
			"Message deleted successfully"
		);
		expect(response.body).toHaveProperty("deletedMessage");
	});
});

describe("Message Already Deleted", () => {
	it("Delete Message By user1", async () => {
		const response = await request(app)
			.delete(`/message/${invalidIds.messageId}`)
			.set("Authorization", `Bearer ${messageAuth.user1.token}`);

		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty("success", false);
		expect(response.body).toHaveProperty(
			"message",
			"Message not found or already deleted"
		);
	});

	it("Delete Message By user2", async () => {
		const response = await request(app)
			.delete(`/message/${invalidIds.messageId}`)
			.set("Authorization", `Bearer ${messageAuth.user2.token}`);
		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty("success", false);
		expect(response.body).toHaveProperty(
			"message",
			"Message not found or already deleted"
		);
	});
});

describe("Valid Delete Chats", () => {
	it("Delete Chat User 1", async () => {
		const response = await request(app)
			.delete(`/message/chat/${messageAuth.user2._id}`)
			.set("Authorization", `Bearer ${messageAuth.user1.token}`);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("success", true);
			expect(response.body).toHaveProperty("message","Chat deleted successfully");
	});

	it("Delete Chat User 1", async () => {
		const response = await request(app)
			.delete(`/message/chat/${messageAuth.user1._id}`)
			.set("Authorization", `Bearer ${messageAuth.user2.token}`);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("success", true);
			expect(response.body).toHaveProperty("message","Chat deleted successfully");
	});
});
