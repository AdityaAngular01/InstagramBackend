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


module.exports = { connectMongoDb, disconnectMongoDb, app };
