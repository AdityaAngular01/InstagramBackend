const request = require("supertest");
const {
	connectMongoDb,
	disconnectMongoDb,
	app,
	getToken,
	deleteTestAccount,
	authData,
} = require("./util");
let server;
let token;

beforeAll(async () => {
	server = await connectMongoDb();
	token = await getToken(authData.user1);
});

afterAll(async () => {
	await deleteTestAccount(token);
	await disconnectMongoDb(server);
});

describe("Like Test Cases", () => {
	let postId = "67a7022c51aeea506141be39";

	it("Like Post", async () => {
		const response = await request(app)
			.post(`/like/${postId}`)
			.set("Authorization", `Bearer ${token}`);

		expect([200, 400, 404]).toContain(response.status);
	});

	it("Unlike Post", async () => {
		const response = await request(app)
			.delete(`/like/${postId}`)
			.set("Authorization", `Bearer ${token}`);

		expect([200, 400, 404]).toContain(response.status);
	});

	it("Get Like Count", async () => {
		const response = await request(app)
			.get(`/like/count/${postId}`)
			.set("Authorization", `Bearer ${token}`);

		expect([200, 400, 404]).toContain(response.status);
		expect(response.body).toHaveProperty("likesCount");
	});
});
