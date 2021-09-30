const path = require("path");

module.exports = {
	mode: "development",
	entry: {
		test: "./test.js",
	},
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, "test"),
	},
	watch: true,
};
