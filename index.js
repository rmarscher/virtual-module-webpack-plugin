'use strict';

const VirtualStats = require('./virtual-stats');

class VirtualModulePlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const moduleName = this.options.moduleName;
    const contents = this.options.contents;
    const ctime = VirtualModulePlugin.statsDate();
    let modulePath = this.options.path;

    compiler.resolvers.normal.plugin('resolve', function resolverPlugin(request, cb) {
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
      VirtualModulePlugin.populateFilesystem({ fs, modulePath, contents, ctime });
      if (cb) {
        cb();
      }
    });
  }

  static populateFilesystem(options) {
    const fs = options.fs;
    const modulePath = options.modulePath;
    const contents = options.contents;
    if (!fs._virtual) {
      fs._virtual = [];
    }
    if (!fs._virtual[modulePath]) {
      fs._virtual[modulePath] = true;
      fs._readFileStorage.data[modulePath] = [null, contents];
      const stats = VirtualModulePlugin.createStats(options);
      fs._statStorage.data[modulePath] = [null, stats];
    }
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
