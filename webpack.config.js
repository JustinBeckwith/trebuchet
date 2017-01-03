const path = require("path");

module.exports = {
  target: 'electron',
  devtool: 'source-map',
  entry: [
    'babel-polyfill',
    './app/renderer.js'
  ],
  output: {
    path: './app',
    filename: 'bundle.js',
  },
  module: {
    noParse: [
      new RegExp('node_modules/localforage/dist/localforage.js')
    ],
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react', 'stage-0']
      }
    }]
  }
}
