# Virtual Module Webpack Plugin

This is an experimental plugin that adds the contents of a virtual file to
Webpack's cached file system without writing it to disk.

This would be used if you generated file contents at build time that needs to
be consumed as a module by your source code, but you don't want to write this
file to disk.

It uses private APIs of the CachedInputFileSystem of the `enhanced-resolve`
package that Webpack uses as the module resolver. Therefore, it is inherently
fragile and subject to be broken if the CachedInputFileSystem changes. However,
the aspects of the CachedInputFileSystem that this plugin depends on hasn't
changed since it was authored over three years ago.

See https://github.com/webpack/enhanced-resolve/blob/master/lib/CachedInputFileSystem.js

A major item that still needs testing is how this operates with the
webpack-dev-server. If it causes the CachedInputFileSystem to purge all of its
cache without triggering the resolve part of the resolver plugin lifecycle,
the virtual file would no longer exist in the cache.

## Usage

In your webpack.config.js, require the plugin:
```
const VirtualModulePlugin = require('./virtual-module-webpack-plugin');
```

Then when defining the config object create an instance of the plugin
passing in the `moduleName` and `contents` and add it to the webpack
config's plugins array.

The `moduleName` should be relative to your webpack config context
which defaults to the directory holding the webpack.config.js file.

```
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

See the example directory for a complete working example.
