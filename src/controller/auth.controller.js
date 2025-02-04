const User = require("../model/user.model");
const { httpStatusCodesUtils: staCode } = require("nodejs-utility-package");
const { hashPassword, verifyPassword } = require("../util/password");
const jose = require("node-jose");
const { getEncryptionKey } = require("../util/keyStore");

const userByEmail = async (email) => {
	return await User.findOne({ email: email });
};

const userByUsername = async (username) => {
	return await User.findOne({ username: username });
};
exports.newUser = async (req, res) => {
	try {
		const { username, email, password, fullName } = req.body;
		if (await userByUsername(username)) {
			return res
				.status(staCode.HTTP_STATUS_CODES.FOUND)
				.json({ message: "Username already exists" });
		}

		if (await userByEmail(email)) {
			return res
				.status(staCode.HTTP_STATUS_CODES.FOUND)
				.json({ message: "Email already exists" });
		}
		const user = new User({
			username: username,
			email: email,
			password: await hashPassword(password),
			fullName: fullName,
		});
		await user.save();
		res.status(staCode.HTTP_STATUS_CODES.CREATED).json({
			message: "User created successfully",
		});
	} catch (err) {
		return res
			.status(staCode.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
			.json({
				message: staCode.getStatusMessage(
					staCode.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
				),
			});
	}
};

exports.login = async (req, res) => {
	try {
		const { email = "", username = "", password = "" } = req.body;
		let user;
		if (email) {
			user = await userByEmail(email);
		} else if (username) {
			user = await userByUsername(username);
		}

		if (!user) {
			return res
				.status(staCode.HTTP_STATUS_CODES.NOT_FOUND)
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
			res.status(staCode.HTTP_STATUS_CODES.OK).json({
				message: "Login successful",
				token: token,
			});
		} else {
			return res
				.status(staCode.HTTP_STATUS_CODES.BAD_REQUEST)
				.json({ message: "Password Incorrect" });
		}
	} catch (error) {
		return res
			.status(staCode.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
			.json({
				message: staCode.getStatusMessage(
					staCode.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
				),
			});
	}
};
