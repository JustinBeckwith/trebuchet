const ElectronConnectWebpackPlugin = require('electron-connect-webpack-plugin');
const path = require("path");

module.exports = {
  devtool: 'source-map',
  entry: [
    'babel-polyfill',
    './ui/scripts/app.js'
  ],
  output: {
    path: './ui/scripts',
    filename: 'app.bundle.js',
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react']
      }
    }]
  },
  plugins: [
    new ElectronConnectWebpackPlugin({
      path: path.join(__dirname, "."),
      logLevel: 0
    }),
  ]
}
