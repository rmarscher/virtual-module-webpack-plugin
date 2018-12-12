# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [0.4.1] - 2018-12-12
### Changed
- Fix deprecation warning in webpack 4. Thanks to @dlmr for pull request #26.

## [0.4.0] - 2018-03-04
### Changed
- Support for webpack 4.
  Extra thanks to @brunomacf for pull request #20 and to the community
  for reporting the issue.

## [0.3.0] - 2017-07-28
### Changed
- Support for webpack > 2.6.1 and enhanced-resolve > 3.3.0.
  Extra thanks to @joaovnogueira for pull request #16 and to the community
  for reporting the issue.

## [0.2.2] - 2017-07-11
### Changed
- Fix to enhanced resolve callback chain by always invoking the callback without arguments.
  Thanks to @MrHayato for pull request #13.

## [0.2.1] - 2017-06-12
### Added
- README.md and integration test update to demonstrate a way to resolve module
  contents asynchronously. Thanks @papandreou and @rangoo94 for the pull requests
  attempts at making it built into the plugin. It seems to only be possible
  by exporting a Promise for the webpack config and resolving the contents before
  resolving the config.

## [0.2.0] - 2017-04-01
### Added
- Function and object support for "contents" from @wujjpp. The value for
  the "contents" config can be an object that will be stringified to JSON or
  a function that will be called at build time.
- Webpack 2 example.
- This changelog.

## [0.1.3] - 2016-11-28
- Fixed issue with tagging the release. Bumped version for publishing to NPM.

## [0.1.2] - 2016-11-28
### Added
- Node 6.x support from @Angelll and nathb2b@gmail.com.
- Syntax highlighting in README from @rmariuzzo

## [0.1.1] - 2016-03-29
### Added
- webpack-dev-server to example.

### Changed
- Cleaned up the plugin code slightly to check
  `fs._readFileStorage.data` for the virtual module instead of the
  `fs._virtual` object I was using. `fs._virtual` was redundant and didn't
  verify that the module hadn't been purged from the file system cache.

## 0.1.0 - 2016-03-29
### Added
- Initial version of project.
- My need for the project was around custom extraction of css styles embedded in
  javascript source files. However, I ended up solving the problem with a custom
  loader in a similar manner to [vue-loader](https://github.com/vuejs/vue-loader).
- I had seen a question on StackOverflow while trying to find an existing
  solution and ended up posting this plugin as an answer.
  http://stackoverflow.com/a/36294904/304438

[0.4.1]: https://github.com/rmarscher/virtual-module-webpack-plugin/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/rmarscher/virtual-module-webpack-plugin/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/rmarscher/virtual-module-webpack-plugin/compare/v0.2.2...v0.3.0
[0.2.2]: https://github.com/rmarscher/virtual-module-webpack-plugin/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/rmarscher/virtual-module-webpack-plugin/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/rmarscher/virtual-module-webpack-plugin/compare/v0.1.3...v0.2.0
[0.1.3]: https://github.com/rmarscher/virtual-module-webpack-plugin/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/rmarscher/virtual-module-webpack-plugin/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/rmarscher/virtual-module-webpack-plugin/compare/v0.1.0...v0.1.1
[0.1.0]: initial version
