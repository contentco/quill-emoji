const path = require('path');

const config = {
	entry: './src/quill-emoji.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'quill-emoji.js'
	}
};

module.exports = config;