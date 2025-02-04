const { app, connectToDb } = require("./index");

const serverPort = process.env.PORT || 8060;

(async () => {
	await connectToDb();
	app.listen(serverPort, () =>
		console.log(`Server listening on ${serverPort}`)
	);
})();
