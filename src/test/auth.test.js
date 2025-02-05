const request = require("supertest");
const { app, connectToDb } = require("../index");
const mongoose = require("mongoose");
const httpUtil = require("../util/http.status.codes")

let server;

beforeAll(async () => {
	await connectToDb(); // Connect to database before tests
	server = app.listen(); // Start the app
});

afterAll(async () => {
	await mongoose.connection.close(); // Close DB connection
	server.close(); // Close server to prevent open handles
});

const auth = {
	username: "testinguser123",
	password: "Testing@123",
	email: "testinguser123@example.com",
	fullName: "Testing User",
};

describe("Auth", () => {
	describe("User Sign Up", () => {
		//User signUp
		it("sign up", async () => {
			const response = await request(app).post("/auth/signup").send({
				username: auth.username,
				password: auth.password,
				email: auth.email,
				fullName: auth.fullName,
			});

			expect([
				httpUtil.CREATED.CODE,
				httpUtil.FOUND.CODE,
			]).toContain(response.status);

			expect([
				"User created successfully",
				"Username already exists",
				"Email already exists",
			]).toContain(response.body.message);

			// console.log(response.body);
		});

		//User Sign Up with Existing Email Address
		it("SignUp with existing email address", async () => {
			const response = await request(app)
				.post("/auth/signup")
				.send({
					username: "testinfinity",
					password: auth.password,
					email: auth.email,
					fullName: auth.fullName,
				})
				.expect(httpUtil.FOUND.CODE);
			expect(response.body).toHaveProperty(
				"message",
				"Email already exists"
			);
		});
		//User Sign up with Existing Username
		it("Sign up with existing username", async () => {
			const response = await request(app).post("/auth/signup").send({
				username: auth.username,
				password: auth.password,
				email: "testuserinfinity@example.com",
				fullName: auth.fullName,
			});
		});
	});

	describe("User Login", () => {
		//Login with Username and Password
		it("Login with username and password", async () => {
			const response = await request(app)
				.post("/auth/login")
				.send({
					loginWith: "username",
					username: auth.username,
					password: auth.password,
				})
				.expect(httpUtil.OK.CODE);

			expect(response.body).toHaveProperty("token");
			// console.log(response.body);
		});

		//Login with email and password
		it("Login with email and password", async () => {
			const response = await request(app)
				.post("/auth/login")
				.send({
					loginWith: "email",
					email: auth.email,
					password: auth.password,
				})
				.expect(httpUtil.OK.CODE);
			expect(response.body).toHaveProperty("token");
			// console.log(response.body);
		});

		//Wrong username and password
		it("Login with Wrong username and password", async () => {
			const response = await request(app)
				.post("/auth/login")
				.send({
					loginWith: "username",
					username: "testuserinfinity",
					password: "wrongpassword",
				})
				.expect(httpUtil.NOT_FOUND.CODE);
			expect(response.body).toHaveProperty("message", "User not found");
			// console.log(response.body);
		});

		//Wrong email and password
		it("Login with Wrong email and password", async () => {
			const response = await request(app)
				.post("/auth/login")
				.send({
					loginWith: "email",
					email: "testuserinfinity@example.com",
					password: "wrongpassword",
				})
				.expect(httpUtil.NOT_FOUND.CODE);
			expect(response.body).toHaveProperty("message", "User not found");
			// console.log(response.body);
		});

		//Login with corrent username and wrong password
		it("Login with correct username and wrong password", async () => {
			const response = await request(app)
				.post("/auth/login")
				.send({
					loginWith: "username",
					username: auth.username,
					password: "wrongpassword",
				})
				.expect(httpUtil.BAD_REQUEST.CODE);
			expect(response.body).toHaveProperty(
				"message",
				"Password Incorrect"
			);
			// console.log(response.body);
		});

		//Login with correct email and wrong password
		it("Login with correct email and wrong password", async () => {
			const response = await request(app)
				.post("/auth/login")
				.send({
					loginWith: "email",
					email: auth.email,
					password: "wrongpassword",
				})
				.expect(httpUtil.BAD_REQUEST.CODE);
			expect(response.body).toHaveProperty(
				"message",
				"Password Incorrect"
			);
			// console.log(response.body);
		});
	});
});
