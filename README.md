# Virtual Module Webpack Plugin [![Build Status](https://travis-ci.org/rmarscher/virtual-module-webpack-plugin.svg?branch=master)](https://travis-ci.org/rmarscher/virtual-module-webpack-plugin) [![codecov.io](https://codecov.io/github/rmarscher/virtual-module-webpack-plugin/coverage.svg?branch=master)](https://codecov.io/github/rmarscher/virtual-module-webpack-plugin?branch=master) [![npm package](https://badge.fury.io/js/virtual-module-webpack-plugin.svg)](https://www.npmjs.com/package/virtual-module-webpack-plugin)

This is an experimental plugin that adds the contents of a virtual file to
Webpack's cached file system without writing it to disk.

This would be used if you generated file contents at build time that needs to
be consumed as a module by your source code, but you don't want to write this
file to disk.

It uses private APIs of the CachedInputFileSystem of the `enhanced-resolve`
package that Webpack uses as the module resolver. Therefore, it is inherently
fragile and subject to be broken if the CachedInputFileSystem changes. Fortunately,
the changes have not been too extensive between webpack 1.x - 4.x and this plugin
has been updated to be compatible with all.

See https://github.com/webpack/enhanced-resolve/blob/master/lib/CachedInputFileSystem.js

If another webpack plugin clears the CachedInputFileSystem without triggering the
resolve event of the resolver plugin lifecycle, the virtual file will no longer be able
to be referenced. Based off the issues received in this plugin's history, this does
not seem to be an issue.

## Difference between val-loader

[val-loader](https://github.com/webpack-contrib/val-loader) is also capable of dynamically
generating module code at build time. val-loader is a "loader" and not a "plugin." Webpack
loaders require a file to exist in webpack's file system cache. Webpack loads the cache
from the files on disk. This virtual-module-webpack-plugin inserts directly into webpack's
file system cache.

val-loader is better if you have a file you want to load at build time that contains all
of the logic to dynamically fetch and return the source of that file. You also are able
to use watch mode in development since there is a physical file to watch.

virtual-module-webpack-plugin is better if you have a build script that is collecting
stats, config or other data that you want to be able to reference in the runtime code
without every writing that data to a source file on disk.

## Usage

In your webpack.config.js, require the plugin:

```js
const VirtualModulePlugin = require('./virtual-module-webpack-plugin');
```

Then when defining the config object create an instance of the plugin
passing in the `moduleName` and `contents` and add it to the webpack
config's plugins array.

The `moduleName` should be relative to your webpack config context
which defaults to the directory holding the webpack.config.js file.

```js
  plugins: [
    new VirtualModulePlugin({
      moduleName: 'src/mysettings.json',
      contents: JSON.stringify({ greeting: 'Hello!' })
    })
  ]
```

Then require the file as you would any other module in your source.
The file contents will be passed through any loaders you setup
that match the moduleName.

If you pass an object to contents, it will automatically be passed through
`JSON.stringify`. You can also pass a function to contents which will be
invoked at compile time with no arguments. See [pull #10](https://github.com/rmarscher/virtual-module-webpack-plugin/pull/10).

See the examples directory for a complete working examples with webpack 1.x,
2.x and 4.x.

If you need to fetch the contents asynchronously, you need to have your `webpack.config.js`
return a Promise. It should first resolve getting your module contents and then
return the Webpack config.

A few development attempts were made at letting the plugin resolve the contents
on demand, but we were unable to get Webpack to wait for a callback during the
resolve stage. See pull requests [#11](https://github.com/rmarscher/virtual-module-webpack-plugin/pull/11)
and [#12](https://github.com/rmarscher/virtual-module-webpack-plugin/pull/12).
Pull requests to solve the problem are welcome, but it needs to work even if the
asynchronous content request takes a while. You can uncomment code in
`test/integration/cases/contents-async/webpack.config.js` to test it.

Here is an example of async content fetching inside webpack.config.js:

```
'use strict';

const VirtualModulePlugin = require('virtual-module-webpack-plugin');

function contents() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('a');
    }, 1000);
  });
}

module.exports = contents().then(asyncContents => ({
  entry: './index',
  plugins: [
    new VirtualModulePlugin({
      moduleName: './a.txt',
      contents: asyncContents,
    }),
  ],
}));
```
