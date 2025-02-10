const request = require("supertest");
const {
	app,
	connectMongoDb,
	disconnectMongoDb,
	getToken,
	authData,
	deleteTestAccount,
	getUserID,
	invalidIds,
} = require("./util");

let server;
const authD = authData;
const auth = {
	user1: {
		_id: "",
		token: "",
	},
	user2: {
		_id: "",
		token: "",
	},
};
const followerFollowingRoutes = {
	followUser: "/follow/",
	unfollowUser: "/follow/",
	followersList: "/follow/followers",
	followingsList: "/follow/following",
	followersCount: "/follow/followers/count",
	followingsCount: "/follow/following/count",
};
beforeAll(async () => {
	server = await connectMongoDb();
	//User 1
	auth.user1.token = await getToken(authD.user1);
	auth.user1._id = await getUserID(auth.user1.token);

	//User 2
	auth.user2.token = await getToken(authD.user2);
	auth.user2._id = await getUserID(auth.user2.token);
});

afterAll(async () => {
	await deleteTestAccount(auth.user1.token);
	await deleteTestAccount(auth.user2.token);
	await disconnectMongoDb(server);
});

describe("Valid Follow Test Cases", () => {
	//First User
	it("User One Follow Another user", async () => {
		const response = await request(app)
			.post(followerFollowingRoutes.followUser + auth.user2._id)
			.set("Authorization", `Bearer ${auth.user1.token}`);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty(
			"message",
			"User followed successfully"
		);
	});

	//Second User
	it("User One Follow Another user", async () => {
		const response = await request(app)
			.post(followerFollowingRoutes.followUser + auth.user1._id)
			.set("Authorization", `Bearer ${auth.user2.token}`);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty(
			"message",
			"User followed successfully"
		);
	});
});

describe("Valid Already Followed Test Cases", () => {
	//First User
	it("User One Already Followed Another user", async () => {
		const response = await request(app)
			.post(followerFollowingRoutes.followUser + auth.user2._id)
			.set("Authorization", `Bearer ${auth.user1.token}`);
		expect(response.status).toBe(409);
		expect(response.body).toHaveProperty(
			"message",
			"You are already following this user"
		);
	});

	//Second User
	it("User One Already Followed Another user", async () => {
		const response = await request(app)
			.post(followerFollowingRoutes.followUser + auth.user1._id)
			.set("Authorization", `Bearer ${auth.user2.token}`);
		expect(response.status).toBe(409);
		expect(response.body).toHaveProperty(
			"message",
			"You are already following this user"
		);
	});
});

describe("Follwers & Following Lists", () => {
	describe("Followers", () => {
		it("User 1", async () => {
			const response = await request(app)
				.get(followerFollowingRoutes.followersList)
				.set("Authorization", `Bearer ${auth.user1.token}`);
			expect(response.status).toBe(200);
		});

		it("User 2", async () => {
			const response = await request(app)
				.get(followerFollowingRoutes.followersList)
				.set("Authorization", `Bearer ${auth.user2.token}`);
			expect(response.status).toBe(200);
		});
	});

	describe("Followings", () => {
		it("User 1", async () => {
			const response = await request(app)
				.get(followerFollowingRoutes.followingsList)
				.set("Authorization", `Bearer ${auth.user1.token}`);
			expect(response.status).toBe(200);
		});
		it("User 2", async () => {
			const response = await request(app)
				.get(followerFollowingRoutes.followingsList)
				.set("Authorization", `Bearer ${auth.user2.token}`);
			expect(response.status).toBe(200);
		});
	});
});

describe("Followers Count", () => {
	it("First User Followers Count", async () => {
		const response = await request(app)
			.get(followerFollowingRoutes.followersCount)
			.set("Authorization", `Bearer ${auth.user1.token}`);
		expect(response.status).toBe(200);
	});

	it("Second User Followers Count", async () => {
		const response = await request(app)
			.get(followerFollowingRoutes.followersCount)
			.set("Authorization", `Bearer ${auth.user2.token}`);
		expect(response.status).toBe(200);
	});
});

describe("Followings Count", () => {
	it("First User Followings Count", async () => {
		const response = await request(app)
			.get(followerFollowingRoutes.followingsCount)
			.set("Authorization", `Bearer ${auth.user1.token}`);
		expect(response.status).toBe(200);
	});
	it("Second User Followings Count", async () => {
		const response = await request(app)
			.get(followerFollowingRoutes.followingsCount)
			.set("Authorization", `Bearer ${auth.user2.token}`);
		expect(response.status).toBe(200);
	});
});

describe("Valid Unfollow Test Cases", () => {
	it("User One Unfollow Another user", async () => {
		const response = await request(app)
			.delete(followerFollowingRoutes.followUser + auth.user2._id)
			.set("Authorization", `Bearer ${auth.user1.token}`);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty(
			"message",
			"User unfollowed successfully"
		);
	});

	it("User One Unfollow Another user", async () => {
		const response = await request(app)
			.delete(followerFollowingRoutes.followUser + auth.user1._id)
			.set("Authorization", `Bearer ${auth.user2.token}`);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty(
			"message",
			"User unfollowed successfully"
		);
	});
});

describe("Invalid Follow Following Tests", () => {
	it("User One Follow Another user(Invalid User)", async () => {
		const response = await request(app)
			.post(followerFollowingRoutes.followUser + invalidIds.userId)
			.set("Authorization", `Bearer ${auth.user1.token}`);
		expect(response.status).toBe(404);
		expect(response.body).toHaveProperty("message", "User not found");
	});

	it("User One Unfollow Another user(Invalid User)", async () => {
		const response = await request(app)
			.delete(followerFollowingRoutes.followUser + invalidIds.userId)
			.set("Authorization", `Bearer ${auth.user1.token}`);
		expect(response.status).toBe(404);
		expect(response.body).toHaveProperty("message", "User not found");
	});
});

describe("Invalid Follow unfollow Ids", () => {
	it("User One Follow Another user(Invalid User)", async () => {
		const response = await request(app)
			.post(followerFollowingRoutes.followUser + "1234567890")
			.set("Authorization", `Bearer ${auth.user1.token}`);
		expect(response.status).toBe(500);
	});

	it("User One Unfollow Another user(Invalid User)", async () => {
		const response = await request(app)
			.delete(followerFollowingRoutes.followUser + "1234567890")
			.set("Authorization", `Bearer ${auth.user1.token}`);
		expect(response.status).toBe(500);
	});
});
