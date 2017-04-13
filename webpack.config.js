const path = require("path");
process.traceDeprecation = true
module.exports = {
  target: 'electron',
  devtool: 'source-map',
  entry: [
    'babel-polyfill',
    './app/renderer.js'
  ],
  output: {
    path: path.join(__dirname, 'app'),
    filename: 'bundle.js',
  },
  module: {
    noParse: [
      new RegExp('node_modules/localforage/dist/localforage.js')
    ],
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react', 'stage-0']
      }
    }]
  }
}
