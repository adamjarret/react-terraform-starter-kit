const path = require('path');

const SRC_DIR = path.resolve(__dirname, 'src');
const OUT_DIR = path.resolve(__dirname, 'build');

const config = {
    entry: {
        RTSKAuthorizer: path.resolve(SRC_DIR, 'RTSKAuthorizer.js'),
        RTSKLogin: path.resolve(SRC_DIR, 'RTSKLogin.js')
    },
    // aws-sdk is already available in the Node.js Lambda environment
    //  so it should not be included in function bundles
    externals: [
        'aws-sdk'
    ],
    output: {
        path: OUT_DIR,
        filename: '[name].js',
        libraryTarget: 'commonjs2'
    },
    target: 'node'
};

module.exports = config;