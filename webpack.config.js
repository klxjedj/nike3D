const path=require('path');
const webpack=require('webpack');


module.exports={
    entry:"./src/index.js",
    output:{
        filename:'bundle.js',
        path:__dirname+'/dis'
    },
    mode:"development",
    devServer:{
        open:true,
        port:80,
        contentBase:"dis",
        hot:true,
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin()
    ],
}