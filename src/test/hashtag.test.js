const request = require('supertest');
const {app, connectMongoDb, disconnectMongoDb, invalidIds} = require('./util');

let server;
let token;
let hashId;

const hashtagRoutes = {
	create: "/hashtag",
    getByName: "/hashtag/",
    addPost: "/hashtag/addPost",
    removePost: "/hashtag/removePost",
    getPosts: "/hashtag/posts/",
    delete: "/hashtag/"
};

const postId = "67a4b61d8d52513dc857afa2";

beforeAll(async () => {
  server = await connectMongoDb();
  token = await require('./userlogin').getToken(app);
});

afterAll(async () => {
  await disconnectMongoDb(server);
});

describe('Valid Hashtag Test Cases', () => {
    it('Create Hashtag', async() => {
        const response = await request(app)
			.post(hashtagRoutes.create)
			.send({
				name: "TestHashtag",
			})
			.set("Authorization", `Baerer ${token}`);
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.hashtag).toHaveProperty('name', 'TestHashtag'.toLowerCase());
        expect(response.body.message).toBe("Hashtag created/found!");

        hashtagRoutes.getByName += response.body.hashtag.name;
        hashId = response.body.hashtag._id;
        hashtagRoutes.delete += hashId;
        hashtagRoutes.getPosts += response.body.hashtag.name;
    });

    it('Get Hashtag By Name', async() => {
        const response = await request(app)
            .get(hashtagRoutes.getByName)
            .set("Authorization", `Baerer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.hashtag).toHaveProperty('name', 'testhashtag'.toLowerCase());
    });

    it('Add Post To Hashtag', async() => {
        const response = await request(app)
			.post(hashtagRoutes.addPost)
			.send({
				hashtagId: hashId,
				postId: postId,
			})
			.set("Authorization", `Baerer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Post added to hashtag");
    });

    it('Remove Post From Hashtag', async() => {
        const response = await request(app)
            .post(hashtagRoutes.removePost)
            .send({
                hashtagId: hashId,
                postId: postId,
            })
            .set("Authorization", `Baerer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Post removed from hashtag");
    });

    it('Get Posts By Hashtag', async() => {
        const response = await request(app)
            .get(hashtagRoutes.getPosts)
            .set("Authorization", `Baerer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        // expect(response.body.posts).toHaveLength(1);
    });

    it('Delete Hashtag', async() => {
        const response = await request(app)
            .delete(hashtagRoutes.delete)
            .set("Authorization", `Baerer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Hashtag deleted successfully");
    });
    
    
});

describe('Invalid Hashtag Test Cases', () => {
    it("Create Hashtag", async () => {
		const response = await request(app)
			.post(hashtagRoutes.create)
			.send({
				name: "",
			})
			.set("Authorization", `Baerer ${token}`);
		expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("success", false);
        expect(response.body.message).toBe("Hashtag name is required");
	});

    it("Get Hashtag By Invalid Name", async () => {
		const response = await request(app)
			.get(hashtagRoutes.getByName+"1")
			.set("Authorization", `Baerer ${token}`);

		expect(response.status).toBe(404);
		expect(response.body.success).toBe(false);
		expect(response.body).toHaveProperty(
			"message",
			"Hashtag not found"
		);
	});

    it("Add Post To Hashtag using Invalid Post ID", async () => {
		const response = await request(app)
			.post(hashtagRoutes.addPost)
			.send({
				hashtagId: hashId,
				postId: invalidIds.postId,
			})
			.set("Authorization", `Baerer ${token}`);

		expect(response.status).toBe(404);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toBe("Post not found");
	});

    it("Delete Hashtag With Invalid Hashtag ID", async () => {
		const response = await request(app)
			.delete(hashtagRoutes.delete)
			.set("Authorization", `Baerer ${token}`);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toBe("Cannot delete hashtag with linked posts");
	});
});

