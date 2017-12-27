const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
let webpack = require('webpack');
// const autoprefixer = requre('autoprefixer');
// require('quill');
// const Quill = require('quill');

const config = {
    entry: './src/n-quill-emoji.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'n-quill-emoji.js',
        library: "n-quill-emoji",
        libraryTarget: "umd"
    },
    devServer: {
      contentBase: path.join(__dirname, "dist"),
      compress: true,
      port: 9000
    },
    module: {
        rules: [
        {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                use: [{
                    loader: 'css-loader',
                    options: {
                        minimize: true || {/* CSSNano Options */}
                    }
                }, {
                    loader: 'sass-loader',
                }]
            }),
        },
        {
            test: /\.js$/,
            include: [
                path.resolve(__dirname, "src/")
            ],
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [['es2015', {modules: false}],]
                }
            }
        },
         {
            test: /\.png$/,
            loader: "file-loader"
        },
        {
            test: require.resolve('quill'),
            // 此loader配置项的目标是NPM中的jquery
            loader: 'expose?$!expose?quill',
            // 先把jQuery对象声明成为全局变量`jQuery`，再通过管道进一步又声明成为全局变量`$`
        },
        ]
    },
    plugins: [
        new ExtractTextPlugin('n-quill-emoji.css'),
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
        }),
        new webpack.ProvidePlugin({
            quill: 'quill',
            Quill: 'quill',
        })
    ]
};

module.exports = config;