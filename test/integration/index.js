/* eslint-disable no-underscore-dangle */

'use strict';

const tap = require('tap');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const cases = fs.readdirSync(path.join(__dirname, 'cases'));

function readFileOrEmpty(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (e) {
    return '';
  }
}

function runTestCase(testCase) {
  return (t) => {
    const testDirectory = path.join(__dirname, 'cases', testCase);
    const outputDirectory = path.join(__dirname, 'dist', testCase);
    let webpackConfig = { entry: { test: './index.js' } };

    const configFile = path.join(testDirectory, 'webpack.config.js');
    if (fs.existsSync(configFile)) {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      webpackConfig = require(configFile);
      if (typeof webpackConfig === 'function') {
        webpackConfig = webpackConfig();
      }
    }
    if (typeof webpackConfig.then !== 'function') {
      webpackConfig = Promise.resolve(webpackConfig);
    }
    webpackConfig.then((options) => {
      options.context = testDirectory;
      if (!options.module) {
        options.module = {};
      }
      if (!options.module.loaders) {
        options.module.loaders = [
          { test: /\.txt$/, loader: ExtractTextPlugin.extract('raw-loader') },
        ];
      }
      if (!options.output) {
        options.output = { filename: '[name].js' };
      }
      if (!options.output.path) {
        options.output.path = outputDirectory;
      }

      webpack(options, (err, stats) => {
        if (err) {
          t.threw(err);
          return;
        }
        if (stats.hasErrors()) {
          t.threw(new Error(stats.toString()));
          return;
        }
        const testFile = path.join(outputDirectory, 'test.js');
        if (fs.existsSync(testFile)) {
          // eslint-disable-next-line import/no-dynamic-require, global-require
          require(testFile)(t);
        }
        const expectedDirectory = path.join(testDirectory, 'expected');
        fs.readdirSync(expectedDirectory).forEach((file) => {
          const filePath = path.join(expectedDirectory, file);
          const actualPath = path.join(outputDirectory, file);
          t.equal(
            readFileOrEmpty(actualPath),
            readFileOrEmpty(filePath),
            `${file} should be correct`
          );
        });
        t.end();
      });
    });
  };
}

tap.test('integration', (t) => {
  t.plan(cases.length);
  cases.forEach((testCase) => {
    t.test(testCase, runTestCase(testCase));
  });
});
