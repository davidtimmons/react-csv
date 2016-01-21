/**
 * React CSV Spreadsheet v1.1.0
 * David Timmons (github@timmons.io)
 * http://david.timmons.io
 * MIT License
 *
 * Configure the Webpack build pipeline.
 */

var path = require('path');
var webpack = require('webpack');


// Configure build based on debug or production mode.
const DEBUG = true;

// Define common plugins.
var plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'commons',
    filename: 'commons.js',
    children: true,
    minChunks: 2
  }),
]

// Define production plugins.
if (!DEBUG) {
  plugins = plugins.concat([
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 51200 // ~50kb
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        warnings: false // Suppress uglification warnings
      }
    })
  ]);
}

// Export Webpack configuration settings.
module.exports = {
  debug: DEBUG,
  devtool: DEBUG ? 'eval' : false,
  entry: './ReactCsv/ReactCsv.js',
  output: {
    path: 'build',
    filename: 'bundle.js'
  },
  plugins: plugins,
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        include: path.join(__dirname, './ReactCsv/'),
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  }
};
