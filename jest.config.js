module.exports = {
	testEnvironment: "node",
	testMatch: ["**/src/test/*.test.js"],
	verbose: true,
	collectCoverage: true,
	testSequencer: require("path").resolve(__dirname, "jest.sequencer.js"),
};
