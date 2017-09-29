var HTMLWebpackPlugin = require('html-webpack-plugin');
var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template:__dirname + '/index.html',
  filename:'index.html',
  inject:'body'
});
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports={
  entry: __dirname + '/src/index.js',
  module:{
    rules:[
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'sass-loader']
        })
      }
    ]
  },
  output:{
    filename: 'transformed.js',
    path: __dirname + '/build'
  },
  plugins:[
    new ExtractTextPlugin("./main.css"),
    require('autoprefixer'),
    HTMLWebpackPluginConfig
  ]
};
