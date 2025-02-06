const request = require("supertest");
const { app, connectMongoDb, disconnectMongoDb } = require("./util");

let server;
let token;

beforeAll(async () => {
	server = await connectMongoDb();
	token = await require("./userlogin").getToken(app);
});

afterAll(async () => {
	await disconnectMongoDb(server);
});

describe("Like Test Cases", () => {
	let postId = "67a4ae93ec3003174f9352b0";

	it("Like Post", async () => {
		const response = await request(app)
			.post(`/like/${postId}`)
			.set("Authorization", `Bearer ${token}`);

		expect([200, 400, 404]).toContain(response.status);
	});

    it('Unlike Post', async() => {
        const response = await request(app)
			.delete(`/like/${postId}`)
			.set("Authorization", `Bearer ${token}`);

		expect([200, 400, 404]).toContain(response.status);
    });

    it('Get Like Count', async() => {
        const response = await request(app)
			.get(`/like/count/${postId}`)
			.set("Authorization", `Bearer ${token}`);

		expect([200, 400, 404]).toContain(response.status);
        expect(response.body).toHaveProperty('likesCount');
    });
    
    
});
