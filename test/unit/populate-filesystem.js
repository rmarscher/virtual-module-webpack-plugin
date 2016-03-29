'use strict';

const tap = require('tap');
const path = require('path');
const CachedInputFileSystem = require('enhanced-resolve/lib/CachedInputFileSystem');
const NodeJsInputFileSystem = require('enhanced-resolve/lib/NodeJsInputFileSystem');
const VirtualModulePlugin = require('../../');

tap.test('stats', (t) => {
  t.plan(4);
  const fs = new NodeJsInputFileSystem();
  const cachedFs = new CachedInputFileSystem(fs, 60);
  const modulePath = path.join(__dirname, 'test.js');
  const contents = '12345';
  VirtualModulePlugin.populateFilesystem({
    fs: cachedFs,
    modulePath,
    contents,
  });
  cachedFs.stat(modulePath, (err, stats) => {
    t.equal(err, null);
    t.equal(stats.isFile(), true);
  });
  cachedFs.readFile(modulePath, (err, readFile) => {
    t.equal(err, null);
    t.equal(readFile, contents);
  });
});
