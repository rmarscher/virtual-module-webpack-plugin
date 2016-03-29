'use strict';

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const VirtualModulePlugin = require('../index');

module.exports = function webpackConfig() {
  const runtimeJsonContents = JSON.stringify({
    greeting: 'Hello!',
  });
  const runtimeStyleContents = `
    body { background: #000; }
  `;

  const config = {
    context: __dirname,
    devtool: 'source-map',
    entry: {
      index: './src/index',
    },
    output: {
      filename: '[name].js',
      path: 'dist',
      publicPath: '/',
      devtoolModuleFilenameTemplate: '../[resource-path]',
    },
    module: {
      loaders: [
        {
          test: /\.json$/,
          loaders: ['json'],
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style', 'css?sourceMap'),
        },
      ],
    },
    plugins: [
      new VirtualModulePlugin({
        moduleName: 'src/mysettings.json',
        contents: runtimeJsonContents,
      }),
      new VirtualModulePlugin({
        moduleName: 'src/css/generated.css',
        contents: runtimeStyleContents,
      }),
      new ExtractTextPlugin('[name].css', { allChunks: true }),
    ],
    resolve: {
      modules: [
        path.join(__dirname, 'src'),
        'node_modules',
      ],
    },
  };
  return config;
};
