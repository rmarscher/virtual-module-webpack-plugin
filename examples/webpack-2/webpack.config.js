'use strict';

const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// in actual use, you would `require('virtual-module-webpack-plugin')` here
const VirtualModulePlugin = require('../../index');

module.exports = function webpackConfig() {
  const runtimeJsonContents = {
    // eslint-disable-next-line quotes, quote-props
    "greeting": "Hello!",
  };
  const runtimeStyleContents = `
    body { background: #000; color: #ccc; }
    .greeting { font: 600 40px/50px fantasy; text-align: center; }
  `;

  const config = {
    context: __dirname,
    devtool: 'source-map',
    entry: {
      index: './src/index',
    },
    output: {
      filename: '[name].js',
      path: path.join(__dirname, 'dist'),
      publicPath: '/',
      devtoolModuleFilenameTemplate: '../[resource-path]',
    },
    module: {
      rules: [
        {
          test: /\.json$/,
          use: [
            {
              loader: 'json-loader',
            },
          ],
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            loader: 'css-loader?sourceMap',
          }),
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
      new ExtractTextPlugin({
        filename: '[name].css',
        allChunks: true,
      }),
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
