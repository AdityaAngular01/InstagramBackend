const bcrypt = require("bcrypt");

exports.hashPassword = async (password) => {
	try {
		const saltRounds = 10;
		return await bcrypt.hash(password, saltRounds);
	} catch (error) {
		throw error;
	}
};

exports.verifyPassword = async (enteredPassword, storedPassword) => {
	try {
		const isMatch = await bcrypt.compare(enteredPassword, storedPassword);
		return isMatch;
	} catch (error) {
		throw error;
	}
};
