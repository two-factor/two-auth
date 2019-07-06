const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './index.js',
  mode: 'development',
    module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            options: {presets: ['@babel/preset-env']}
          }
        ]
      },
        output: {
          path: path.resolve(__dirname, "dist/"),
          publicPath: '/dist/',
          filename: 'bundle.js'
        }
}