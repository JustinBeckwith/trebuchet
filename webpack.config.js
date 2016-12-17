const ElectronConnectWebpackPlugin = require('electron-connect-webpack-plugin');
const path = require("path");

module.exports = {
  target: 'electron',
  devtool: 'source-map',
  entry: [
    'babel-polyfill',
    './src/scripts/app.js'
  ],
  output: {
    path: './src/scripts',
    filename: 'app.bundle.js',
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react', 'stage-0']
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
