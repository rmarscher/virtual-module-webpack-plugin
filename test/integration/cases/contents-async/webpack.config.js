'use strict';

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const VirtualModulePlugin = require('../../../../index');

function contents() {
  // Uncomment the following Promise to test async contents that take a while
  // to resolve. It is commented to keep the tests from taking long to run.
  // return new Promise(resolve => {
  //   setTimeout(() => {
  //     resolve('a');
  //   }, 1000);
  // });
  return Promise.resolve('a');
}

// If we could figure out how to get webpack to delay the resolve until a
// callback is called, this would work. But unfortunately, that doesn't
// seem to be happening. More investigation of webpack internals would be
// necessary to figure out if there's a way.
// module.exports = function webpackConfig() {
//   return {
//     entry: './index',
//     plugins: [
//       new VirtualModulePlugin({
//         moduleName: './a.txt',
//         contents,
//       }),
//       new ExtractTextPlugin('file.txt'),
//     ],
//   };
// };

// For now, this is the recommended way to deal with async contents. Have the
// webpack config return a Promise and resolve the async contents first before
// resolving the webpack config. Latest versions of Webpack 1 and 2 should support
// a Promise-based config. If you call webpack API directly (as done in the
// integration tests here in test/integration/index.js), you need to resolve
// the Promise before calling webpack.
module.exports = contents().then(asyncContents => ({
  entry: './index',
  plugins: [
    new VirtualModulePlugin({
      moduleName: './a.txt',
      contents: asyncContents,
    }),
    new ExtractTextPlugin('file.txt'),
  ],
}));
