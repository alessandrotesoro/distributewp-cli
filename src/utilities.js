#!/usr/bin/env node
const fs = require('fs-extra')

module.exports = {

	fileExists: function (filePath) {

		try {
			return fs.statSync(filePath).isFile();
		} catch (error) {
			return false;
		}

	},

	dirExists: function (dirPath) {

		try {
			return fs.statSync(dirPath).isDirectory();
		} catch (error) {
			return false;
		}

	},

};
