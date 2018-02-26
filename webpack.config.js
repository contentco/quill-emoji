const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const config = {
    entry: './src/quill-emoji.js',
    output: {
        filename: 'quill-emoji.js',
        path: path.resolve(__dirname, 'dist'),
        library: "QuillEmoji",
        libraryTarget: "umd"
    },
    externals: {
        quill: 'Quill',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, "src/")
                ],
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [['env', {modules: false}],]
                    }
                }
            }
        ]
    },
    plugins: [
        new UglifyJSPlugin({
            compress: {
                warnings: false,
                screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                join_vars: true,
                if_return: true
            },
            output: {
                comments: false
            }
        })
    ]
};

module.exports = config;