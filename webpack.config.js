const path = require('path');
const webpack = require('webpack');


module.exports = {
    entry: "./src/index.js",
    output: {
        filename: 'bundle.js',
        path:path.join(__dirname,'dis')
    },
    mode: "development",
    devServer: {
        open: true,
        port: 80,
        contentBase:'./dis',
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [{
                    loader: "babel-loader",
                }],
            },
            {
                test: /\.(jpg|png|svg|gif)$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: 'images/[name].[ext]'
                    }
                }]
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]


    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
}