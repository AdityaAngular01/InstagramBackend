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


module.exports = { connectMongoDb, disconnectMongoDb, app , invalidIds};
