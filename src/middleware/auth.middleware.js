const jose = require("node-jose");
const { getEncryptionKey } = require("../util/keyStore");

// Middleware to authenticate JWE token
const authenticateToken = async (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "You are not logged in" });
	}

	try {
		// Decrypt the JWE token
		const encryptionKey = getEncryptionKey();
		const result = await jose.JWE.createDecrypt(encryptionKey).decrypt(
			token
		);
		const payload = JSON.parse(result.plaintext.toString());

		// Attach user data to the request
		req.user = payload;
		next();
	} catch (err) {
		return res.status(403).json({ message: "Invalid or expired token" });
	}
};

module.exports = {auth:authenticateToken};
