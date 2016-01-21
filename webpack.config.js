/**
 *
 */

var path = require('path');

module.exports = {
  entry: './ReactCsv/ReactCsv.js',
  output: {
    path: 'build',
    filename: 'bundle.js'
  },
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
