const request = require("supertest");
const mongoose = require("mongoose");
const { app, connectToDb } = require("../index");

const connectMongoDb = async () => {
	await connectToDb();
	return app.listen();
};

const disconnectMongoDb = async (server) => {
	await mongoose.connection.close();
	server.close();
};

const invalidIds = {
	postId: "123456789012345678901234",
	commentId: "123456789012345678901234",
	userId: "123456789012345678901234",
	likeId: "123456789012345678901234",
};

const authData = {
	user1: {
		username: "ganeshturate",
		fullName: "Ganesh Turate",
		email: "ganeshturate@gmail.com",
		password: "Ganesh@123",
	},
	user2: {
		username: "sanketparsewar",
		fullName: "Sanket Parsewar",
		email: "sanketparsewar@gmail.com",
		password: "Sanket@123",
	},
};

const post = {
	url: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
	caption: "This is a caption",
};

//Sign Up And Return token
const getToken = async(auth)=>{
	const signUp = await request(app).post("/auth/signup").send(auth);

	const response = await request(app)
		.post("/auth/login")
		.send({
			loginWith: "username",
			username: auth.username,
			password: auth.password,
		});
    return response.body.token;
}

//Get User ID
const getUserID = async(token)=>{
	const response = await request(app)
		.get("/user/info")
		.set("Authorization", `Bearer ${token}`);
    return response.body._id;
}

// Delete Account
const deleteTestAccount = async (token) => {
	const response = await request(app)
		.delete("/user/delete/account")
		.set("Authorization", `Bearer ${token}`);
	return "";
};

//Posts
//Create Post
// const postId = async(token)=>{
// 	const newPost = await request(app)
// 		.post("/post")
// 		.send({
// 			imageUrl: post.url,
// 			caption: post.caption,
// 		})
// 		.set("Authorization", `Bearer ${token}`);
// 	const response = await request(app)
// }


module.exports = {
	connectMongoDb,
	disconnectMongoDb,
	app,
	invalidIds,
	getToken,
	deleteTestAccount,
	authData,
	PostData: post,
	getUserID,
};
