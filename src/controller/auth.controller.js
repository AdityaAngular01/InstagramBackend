const User = require("../model/user.model");
const { hashPassword, verifyPassword } = require("../util/password");
const jose = require("node-jose");
const { getEncryptionKey } = require("../util/keyStore");
const {internalServerError} = require("./error.controller")
const httpUtil = require("../util/http.status.codes")


exports.newUser = async (req, res) => {
	try {
		const { username, email, password, fullName } = req.body;

		// Check for existing user before saving
		const existingUser = await User.findOne({
			$or: [{ username }, { email }],
		});

		if (existingUser) {
			if (existingUser.username === username) {
				return res
					.status(httpUtil.FOUND.CODE)
					.json({ message: "Username already exists" });
			}
			if (existingUser.email === email) {
				return res
					.status(httpUtil.FOUND.CODE)
					.json({ message: "Email already exists" });
			}
		}

		// Create and save new user
		const user = new User({
			username,
			email,
			password: await hashPassword(password),
			fullName,
		});

		await user.save();
		res.status(httpUtil.CREATED.CODE).json({
			message: "User created successfully",
		});
	} catch (err) {
		// Handle duplicate key error (E11000)
		if (err.code === 11000) {
			const field = Object.keys(err.keyPattern)[0]; // Get the duplicate field
			return res.status(httpUtil.FOUND.CODE).json({
				message: `${
					field.charAt(0).toUpperCase() + field.slice(1)
				} already exists`,
			});
		}

		// Handle other errors
		console.log(err);
		return internalServerError(req, res, err);
	}
};


exports.login = async (req, res) => {
	try {
		const { email = "", username = "", password = "" } = req.body;
		let user;
		if (email) {
			user = await User.findByEmailId(email);
		} else if (username) {
			user = await User.findByUsername(username);
		}

		if (!user) {
			return res
				.status(httpUtil.NOT_FOUND.CODE)
				.json({ message: "User not found" });
		}

		if (await verifyPassword(password, user.password)) {
			const playload = {
				_id: user._id,
			};
			const encryptionKey = getEncryptionKey();
			const token = await jose.JWE.createEncrypt(
				{ format: "compact" },
				encryptionKey
			)
				.update(JSON.stringify(playload))
				.final();
			await user.setActive();
			res.status(httpUtil.OK.CODE).json({
				message: "Login successful",
				token: token,
			});
		} else {
			return res
				.status(httpUtil.BAD_REQUEST.CODE)
				.json({ message: "Password Incorrect" });
		}
	} catch (error) {
		// console.log(error);
		return internalServerError(req, res, error);
	}
};
