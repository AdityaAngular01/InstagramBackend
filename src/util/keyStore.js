const jose = require("node-jose");

// Create a key store for managing cryptographic keys
const keystore = jose.JWK.createKeyStore();
let encryptionKey;

// Generate a key for encryption (AES-256)
(async () => {
	encryptionKey = await keystore.generate("oct", 256, {
		alg: "A256GCM",
		use: "enc",
	});
})();

module.exports = {
	getEncryptionKey: () => encryptionKey,
};
