const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const autoprefixer = requre('autoprefixer');

const config = {
    entry: './src/quill-emoji.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'quill-emoji.js'
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                use: [{
                    loader: 'css-loader',
                    options: {
                        minimize: true || {/* CSSNano Options */}
                    }
                }]
            })
        }]
    },
    plugins: [
        new ExtractTextPlugin('quill-emoji.css'),
    ]
};

module.exports = config;