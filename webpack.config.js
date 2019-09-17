const path = require('path');
const webpack = require('webpack');


module.exports = {
    entry: "./src/index.js",
    output: {
        filename: 'bundle.js',
        path: __dirname + '/dis'
    },
    mode: "development",
    devServer: {
        open: true,
        port: 80,
        contentBase: "dis",
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
                test:/\.(jpg|png|svg|gif)$/,
                use:[{
                    loader:"file-loader",
                    options:{
                        name:'images/[name].[ext]'}
                }]
            }
        ]


    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
}