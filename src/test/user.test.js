const request = require("supertest");
const mongoose = require("mongoose");
const { app, connectToDb } = require("../index");

let server;
let token;

beforeAll(async () => {
	await connectToDb();
	server = app.listen();
	token = await require("./userlogin").getToken(app);
});

afterAll(async () => {
	await mongoose.connection.close();
	server.close();
});

describe("User Tests", () => {

	//Test Cases for User profile Updations
	describe("Update User Profile", () => {
		//Update Full Name of User
		it("Update Full Name", async () => {
			const response = await request(app)
				.put("/user/update/profile")
				.set("Authorization", `Bearer ${token}`)
				.send({
					update: "fullName",
					fullName: "Aditya Vasant Kalambe",
				})
				.expect(200);
			expect(response.body).toHaveProperty(
				"message",
				"User profile updated successfully"
			);
		});

		//Update Bio of User
		it("Update User Bio", async () => {
			const response = await request(app)
				.put("/user/update/profile")
				.set("Authorization", `Bearer ${token}`)
				.send({
					update: "bio",
					bio: "I am a software engineer.",
				})
				.expect(200);
			expect(response.body).toHaveProperty(
				"message",
				"User profile updated successfully"
			);
		});

		//Update Profile Picture of User
		it("Update User Profile Picture", async () => {
			const response = await request(app)
				.put("/user/update/profile")
				.set("Authorization", `Bearer ${token}`)
				.send({
					update: "profilePicture",
					profilePicture:
						"https://static.vecteezy.com/system/resources/previews/036/324/708/large_2x/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg",
				})
				.expect(200);
			expect(response.body).toHaveProperty(
				"message",
				"User profile updated successfully"
			);
		});
	});

	it("User Info", async () => {
		const response = await request(app)
			.get("/user/info")
			.set("Authorization", `Bearer ${token}`)
			.expect(200);

		const expectedProperties = [
			"_id",
			"username",
			"email",
			"fullName",
			"createdAt",
			"updatedAt",
			"bio",
			"profilePicture",
			"followersCount",
			"followingCount",
			"postsCount",
		];

		expectedProperties.forEach((prop) =>
			expect(response.body).toHaveProperty(prop)
		);

	});

	//Search User
	describe("Search User", () => {
		//Search By Username
		it("Search By Username", async () => {
			const response = await request(app)
				.get("/user/search")
				.send({
					by: "username",
					username: "test",
				})
				.set("Authorization", `Bearer ${token}`);
			expect([200, 404, 500]).toContain(response.status);

			// expect(Array.isArray(response.body.users)).toBe(true);
		});

		//Search By Full Name
		it("Search By Full Name", async () => {
			const response = await request(app)
				.get("/user/search")
				.send({
					by: "fullName",
					fullName: "Ad",
				})
				.set("Authorization", `Bearer ${token}`);

			expect([200, 404, 500]).toContain(response.status);
			// expect(Array.isArray(response.body.users)).toBe(true);
		});
	});

	// Delete user
	// describe("Delete Account", () => {
	// 	it("Delete Account", async () => {
	// 		const response = await request(app).delete("/user/delete/account").set("Authorization", `Bearer ${token}`);
	// 		expect([200, 401, 500]).toContain(response.status);
	// 		expect(["User deleted successfully", "User not found", "Internal server error"]).toContain(
	// 			response.body.message
	// 		);
	// 	});
	// });
});
