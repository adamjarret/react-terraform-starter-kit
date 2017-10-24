const path = require('path');
const webpack = require('webpack');

const APP_DIR = path.resolve(__dirname, 'client');
const OUT_DIR = path.resolve(__dirname, 'bucket', 'public');

const config = {
    entry: path.resolve(APP_DIR, 'index.jsx'),
    output: {
        path: OUT_DIR,
        filename: 'bundle.js'
    },
    resolve: {
        modules: [
            path.join(__dirname),
            'node_modules'
        ],
        alias: {'~': APP_DIR},
        extensions: ['.js', '.jsx']
    },
    plugins: [
        new webpack.EnvironmentPlugin([
            'NODE_ENV'
        ])
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.jsx?$/,
                include: APP_DIR,
                loader: 'babel-loader'
            }
        ]
    }
};

module.exports = config;
