const Sequencer = require("@jest/test-sequencer").default;

class CustomSequencer extends Sequencer {
	sort(tests) {
		const order = [
			"auth.test.js",
			"followerFollowing.test.js",
			"user.test.js",
            "comment.test.js",
			"message.test.js",
            "like.test.js",
            "hashtag.test.js",
            "post.test.js",
		];

		return tests.sort((a, b) => {
			const indexA = order.indexOf(a.path.split("/").pop());
			const indexB = order.indexOf(b.path.split("/").pop());

			return (
				(indexA === -1 ? order.length : indexA) -
				(indexB === -1 ? order.length : indexB)
			);
		});
	}
}

module.exports = CustomSequencer;
