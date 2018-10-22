const path = require('path');
const merge = require('webpack-merge');
const WriteFilePlugin = require('write-file-webpack-plugin');
const html = require('../dev/webpack-html');
const mockService = require('../dev/mock-service');
const common = require('./webpack.common.js');
const templateParameters = require('../dev/mock-terraform_output.json');

const BUCKET_DIR = path.resolve(__dirname, '..', 'bucket');

process.env.Password = process.env.Password || 'welcome';

module.exports = merge(common, {
    mode: 'development',
    output: {
        publicPath: templateParameters.bucket_url.value + '/public/'
    },
    plugins: [
        // render index.html template
        html({templateParameters}),
        // force webpack-dev-server to write files to disk (has no effect on webpack command)
        new WriteFilePlugin()
    ],
    devServer: {
        // listen on all interfaces
        host: '0.0.0.0',
        // listen on specified port
        port: 8080,
        // redirect 404s to /index.html (so react-router can handle the URL)
        historyApiFallback: true,
        // serve files from "bucket/public" (so index.html is found) and "bucket" directory (so URLs work)
        contentBase: [path.join(BUCKET_DIR, 'public'), BUCKET_DIR],
        // simulate real AWS infrastructure
        after: mockService
    }
});
