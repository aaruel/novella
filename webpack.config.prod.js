const path = require('path');
const webpack = require('webpack');
const BabiliPlugin = require('babili-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

process.noDeprecation = true;

module.exports = {
  devtool: 'none',
  entry: [
    'whatwg-fetch',
    'babel-polyfill',
    path.join(__dirname, 'src/index.js')
  ],
  output:{
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins:[
    new ExtractTextPlugin("main.css"),
    require('autoprefixer'),
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: 'body'
    }),
    new BabiliPlugin(),
    new UglifyJSPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ],
  module:{
    rules:[
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: path.join(__dirname, 'src'),
        loader: 'babel-loader',
        query: {
          presets: [
            'env',
            'es2017',
            'react',
            'stage-1'
          ],
          plugins: ["transform-decorators-legacy"]
        }
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'sass-loader']
        })
      }
    ]
  }
};
