'use strict';

const tap = require('tap');
const VirtualModulePlugin = require('../../');

tap.test('stats', (t) => {
  const stats = VirtualModulePlugin.createStats({
    contents: '12345',
  });
  t.equal(stats.isFile(), true);
  t.equal(stats.isDirectory(), false);
  t.equal(stats.isBlockDevice(), false);
  t.equal(stats.isCharacterDevice(), false);
  t.equal(stats.isSymbolicLink(), false);
  t.equal(stats.isFIFO(), false);
  t.equal(stats.isSocket(), false);
  t.equal(stats.size, 5);
  t.end();
});

tap.test('stats-empty', (t) => {
  const stats = VirtualModulePlugin.createStats();
  t.equal(stats.isFile(), true);
  t.equal(stats.isDirectory(), false);
  t.equal(stats.isBlockDevice(), false);
  t.equal(stats.isCharacterDevice(), false);
  t.equal(stats.isSymbolicLink(), false);
  t.equal(stats.isFIFO(), false);
  t.equal(stats.isSocket(), false);
  t.equal(stats.size, 0);
  t.end();
});

