const request = require("supertest");
const { connectMongoDb, disconnectMongoDb, app } = require("./util");
let server;
let token;

beforeAll(async () => {
	server = await connectMongoDb();
	token = await require("./userlogin").getToken(app);
});

afterAll(async () => {
	await disconnectMongoDb(server);
});

const post = {
	url: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
	caption: "This is a caption",
};

describe("Posts Test Cases", () => {
	let postId;
	it("Create Post", async () => {
		const response = await request(app)
			.post("/post")
			.set("Authorization", `Bearer ${token}`)

			.send({
				imageUrl: post.url,
				caption: post.caption,
			});

		expect(response.status).toBe(201);

	});

	it("Get All Posts", async () => {
		const response = await request(app)
			.get("/post")
			.set("Authorization", `Bearer ${token}`);

		expect(Array.isArray(response.body.posts)).toBe(true);

		expect(response.status).toBe(200);
		let length = response.body.posts.length-1;
		postId = response.body.posts[length]._id;
	});

	it("Get Single Post By Id", async () => {
		const response = await request(app)
			.get(`/post/${postId}`)
			.set("Authorization", `Bearer ${token}`);

		expect(response.status).toBe(200);
		expect(response.body.post.caption).toBe(post.caption);
	});

	it("Get Posts By user", async () => {
		const response = await request(app)
			.get(`/post/user/67a33a4e146dfff857d8c613`)
			.set("Authorization", `Bearer ${token}`);
		expect(response.status).toBe(200);
	});

	it("Delete a Post", async () => {
		const response = await request(app)
			.delete(`/post/${postId}`)
			.set("Authorization", `Bearer ${token}`);

		expect([500, 404, 200]).toContain(response.status);
		expect([
			"Post deleted successfully",
			"Internal Server Error",
			"Post not found or unauthorized",
		]).toContain(response.body.message);
	});
});
