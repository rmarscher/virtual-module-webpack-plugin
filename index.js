/* eslint-disable no-underscore-dangle */

'use strict';

const VirtualStats = require('./virtual-stats');

class VirtualModulePlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const moduleName = this.options.moduleName;
    const ctime = VirtualModulePlugin.statsDate();
    let modulePath = this.options.path;

    let contents;
    if (typeof this.options.contents === 'string') {
      contents = this.options.contents;
    }
    if (typeof this.options.contents === 'object') {
      if (typeof this.options.contents.then !== 'function') {
        contents = JSON.stringify(this.options.contents);
      }
    }
    if (typeof this.options.contents === 'function') {
      contents = this.options.contents();
    }
    if (typeof contents === 'string') {
      contents = Promise.resolve(contents);
    }

    function resolverPlugin(request, cb) {
      // populate the file system cache with the virtual module
      const fs = this.fileSystem;

      // webpack 1.x compatibility
      if (typeof request === 'string') {
        request = cb;
        cb = null;
      }

      if (!modulePath) {
        modulePath = this.join(compiler.context, moduleName);
      }

      const resolve = (data) => {
        VirtualModulePlugin.populateFilesystem({ fs, modulePath, contents: data, ctime });
      };

      const resolved = contents.then(resolve);
      if (!cb) {
        return;
      }

      resolved.then(cb);
    }

    if (!compiler.resolvers.normal) {
      compiler.plugin('after-resolvers', () => {
        compiler.resolvers.normal.plugin('resolve', resolverPlugin);
      });
    } else {
      compiler.resolvers.normal.plugin('resolve', resolverPlugin);
    }
  }

  static populateFilesystem(options) {
    const fs = options.fs;
    const modulePath = options.modulePath;
    const contents = options.contents;
    if (fs._readFileStorage.data[modulePath]) {
      return;
    }
    const stats = VirtualModulePlugin.createStats(options);
    fs._statStorage.data[modulePath] = [null, stats];
    fs._readFileStorage.data[modulePath] = [null, contents];
  }

  static statsDate(inputDate) {
    if (!inputDate) {
      inputDate = new Date();
    }
    return inputDate.toString();
  }

  static createStats(options) {
    if (!options) {
      options = {};
    }
    if (!options.ctime) {
      options.ctime = VirtualModulePlugin.statsDate();
    }
    if (!options.mtime) {
      options.mtime = VirtualModulePlugin.statsDate();
    }
    if (!options.size) {
      options.size = 0;
    }
    if (!options.size && options.contents) {
      options.size = options.contents.length;
    }
    return new VirtualStats({
      dev: 8675309,
      nlink: 1,
      uid: 501,
      gid: 20,
      rdev: 0,
      blksize: 4096,
      ino: 44700000,
      mode: 33188,
      size: options.size,
      atime: options.mtime,
      mtime: options.mtime,
      ctime: options.ctime,
      birthtime: options.ctime,
    });
  }
}

module.exports = VirtualModulePlugin;
