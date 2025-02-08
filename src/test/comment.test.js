const request = require("supertest");
const {
	app,
	connectMongoDb,
	disconnectMongoDb,
	invalidIds,
} = require("./util");

let server;
let token;
let postId = "67a7022c51aeea506141be39";
let commentId;

beforeAll(async () => {
	server = await connectMongoDb();
	token = await require("./userlogin").getToken(app);
});

afterAll(async () => {
	await disconnectMongoDb(server);
});

describe("Valid Comments Test", () => {
	it("Comment on Post", async () => {
		const response = await request(app)
			.post(`/comment/${postId}`)
			.send({ text: "This is an test comment!!!" })
			.set("Authorization", `Bearer ${token}`);

		expect(response.status).toBe(201);
		expect(response.body.success).toBe(true);
		expect(response.body).toHaveProperty("comment");
	});

	it("Get Comments For Posts", async () => {
		const response = await request(app)
			.get(`/comment/${postId}`)
			.set("Authorization", `Bearer ${token}`);

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("comments");

		commentId = response.body.comments[0]._id;
	});

	it("Get Comments Count", async () => {
		const response = await request(app)
			.get(`/comment/count/${postId}`)
			.set("Authorization", `Bearer ${token}`);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("totalComments");
		expect(response.body.totalComments).toBeGreaterThanOrEqual(0);
	});

	it("Update Comment", async () => {
		const response = await request(app)
			.put(`/comment/${commentId}`)
			.send({ text: "Updated Comment!!!" })
			.set("Authorization", `Bearer ${token}`);

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("success");
		expect(response.body.success).toBe(true);
		expect(response.body).toHaveProperty("comment");
	});

	it("Delete Comment", async () => {
		const response = await request(app)
			.delete(`/comment/${postId}/${commentId}`)
			.set("Authorization", `Bearer ${token}`);

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("success");
		expect(response.body.success).toBe(true); // Comment should be deleted successfully.
	});
});

describe("Invalid Comments Tests", () => {
	it("Unauthorized Post to comment", async () => {
		const response = await request(app)
			.post(`/comment/${invalidIds.postId}`)
            .send({text: "InValid Comment"})
			.set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty(
			"message",
			"Post not found or unauthorized"
		);
	});

	it("Unauthorized Post to Comment", async () => {
        const response = await request(app)
			.post(`/comment/${invalidIds.postId.slice(0, 20)}`)
			.send({ text: "InValid Comment" })
			.set("Authorization", `Bearer ${token}`);

		expect(response.status).toBe(500);        
    });

	it("Unauthorized Comment to Delete", async() => {
        const response = await request(app)
            .delete(`/comment/${postId}/${invalidIds.commentId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty(
			"message",
			"Comment not found or unauthorized"
		);
    });

    it("Unauthorized Comment to Update", async() => {
        const response = await request(app)
           .put(`/comment/${invalidIds.commentId}`)
           .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty(
			"message",
			"Comment not found or unauthorized"
		);
    });

    it('Invalid Post ID to Delete Comment', async() => {
        const response = await request(app)
			.delete(`/comment/${invalidIds.postId}/${commentId}`)
			.set("Authorization", `Bearer ${token}`);

		expect(response.status).toBe(404);
		expect(response.body).toHaveProperty(
			"message",
			"Post not found or unauthorized"
		);
    });
    

    it('Invalid Comment to update', async() => {
        const response = await request(app)
			.put(`/comment/${invalidIds.commentId.slice(0,20)}`)
			.set("Authorization", `Bearer ${token}`);

		expect(response.status).toBe(500);        
    });
    

	it("Unauthorized User Commit", async() => {
		const response = await request(app)
            .post(`/comment/${postId}`)
            .send({ text: "InValid Comment" });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty(
			"message",
			"You are not logged in"
		);
	});

	it("Unauthorized User Commit", async () => {
		const response = await request(app)
			.post(`/comment/${postId}`)
			.send({ text: "InValid Comment" })
			.set("Authorization", `Bearer ${token.concat("123456")}`);

		expect(response.status).toBe(403);
		expect(response.body).toHaveProperty(
			"message",
			"Invalid or expired token"
		);
	});
	
});


