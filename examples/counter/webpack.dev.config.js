var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: [
    './vendor.ts',
    './index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ],
 resolve: {
   extensions: ['', '.webpack.js', '.web.js', '.ts', '.js'],
   fallback: __dirname + '/../../node_modules',
   root: [
     __dirname + '/../../node_modules',
     'node_modules'
   ],
   alias: {		
     angular2$: __dirname + '/../../node_modules/angular2',
     'ng2-redux$':__dirname + '/../../src'
     }
  },

  module: {
    loaders: [
      { test: /\.ts$/,  loader: 'ts-loader', exclude: /node_modules/ },
      { test: /\.js$/,  loader: 'babel', exclude: /node_modules/ }
    ]
  },
  noParse: [
    /rtts_assert\/src\/rtts_assert/
  ]
};
