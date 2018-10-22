# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2018-10-22
### Added
- Configuration for [webpack-dev-server] so UI can be previewed locally
- Configuration for [s3-publish] for finer control over uploading files to S3 (also removes dependency on AWS CLI)


### Changed
- Update to [React] 16
- Update to [Webpack] 4
- Update to [Babel] 7
- Update to [Material-UI] 3
- Code splitting is now implemented for the client bundle using dynamic imports via [react-loadable]
- Lambda functions are now bundled with webpack so they may `require` dependencies

### Removed
- __.idea__ directory - now ignored
- __styles/bootstrap__ directory - Material-UI now provides a responsive grid, so Bootstrap is no longer needed
- [react-tap-event-plugin] - deprecated
- [keymirror] - breaks IDE autocomplete
- [ncp] - replaced with [copy-webpack-plugin]
- [mustache] - replaced with [html-webpack-plugin] + [mustache-loader]
- [superagent] - replaced with [ky]
- [babel-preset-es2015] - replaced with [@babel/preset-env][preset-env]

[2.0.0]: https://github.com/adamjarret/react-terraform-starter-kit/compare/v1.0.0...v2.0.0


[s3-publish]: https://www.npmjs.com/package/s3-publish

[webpack-dev-server]: https://webpack.js.org/configuration/dev-server/

[webpack]: https://webpack.js.org/

[material-ui]: https://www.npmjs.com/package/@material-ui/core

[babel]: https://www.npmjs.com/package/@babel/core

[preset-env]: https://www.npmjs.com/package/@babel/preset-env

[babel-preset-es2015]: https://www.npmjs.com/package/babel-preset-es2015

[superagent]: https://www.npmjs.com/package/superagent

[ky]: https://www.npmjs.com/package/ky

[ncp]: https://www.npmjs.com/package/ncp

[copy-webpack-plugin]: https://www.npmjs.com/package/copy-webpack-plugin

[html-webpack-plugin]: https://www.npmjs.com/package/html-webpack-plugin

[mustache-loader]: https://www.npmjs.com/package/mustache-loader

[mustache]: https://www.npmjs.com/package/mustache

[keymirror]: https://www.npmjs.com/package/keymirror

[react-tap-event-plugin]: https://www.npmjs.com/package/react-tap-event-plugin

[react-loadable]: https://www.npmjs.com/package/react-loadable

[react]: https://reactjs.org