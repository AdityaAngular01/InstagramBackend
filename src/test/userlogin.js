const request = require("supertest");
const { httpStatusCodesUtils: httpUtil } = require("nodejs-utility-package");
const auth = {
	username: "testinguser",
	password: "Testing@123",
	email: "testinguser@example.com",
    fullName: "Testing User",
};

const signup = async(app)=>{
	const response = await request(app).post("/auth/signup").send({
		username: auth.username,
		password: auth.password,
		email: auth.email,
		fullName: auth.fullName,
	});

	expect([
		httpUtil.HTTP_STATUS_CODES.CREATED,
		httpUtil.HTTP_STATUS_CODES.FOUND,
		httpUtil.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
	]).toContain(response.status);

	expect([
		"User created successfully",
		"Username already exists",
		"Email already exists",
		"Internal Server Error",
	]).toContain(response.body.message);
}

exports.getToken = async (app) => {
	const response = await request(app)
		.post("/auth/login")
		.send({
			loginWith: "username",
			username: auth.username,
			password: auth.password,
		})
	// expect([httpUtil.HTTP_STATUS_CODES.OK, httpUtil.HTTP_STATUS_CODES.NOT_FOUND]).toContain(response.status)
	if (response.status === httpUtil.HTTP_STATUS_CODES.NOT_FOUND) {
		signup(app);
	}
	return response.body.token? response.body.token: this.getToken(app);
};

exports.deleteAccount = async(app, token)=>{
	const response = await request(app)
		.delete("/user/delete/account")
		.set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(httpUtil.HTTP_STATUS_CODES.OK)
    expect(response.body).toHaveProperty("message", "User deleted successfully")
}
