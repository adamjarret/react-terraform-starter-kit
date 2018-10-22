const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const APP_DIR = __dirname;
const BUCKET_DIR = path.resolve(__dirname, '..', 'bucket');

module.exports = {

    entry: {
        bundle: path.join(APP_DIR, 'index.jsx')
    },
    output: {
        path: path.join(BUCKET_DIR, 'public'),
        filename: '[name].js',
        chunkFilename: 'bundle-[name].js'
    },
    plugins: [
        // Copy static files to public directory
        new CopyWebpackPlugin([{
            from: path.join(APP_DIR, 'static', '**', '*'),
            flatten: true
        }])
    ],
    resolve: {
        modules: [
            APP_DIR,
            'node_modules'
        ],
        alias: {'~': APP_DIR},
        extensions: ['.js', '.jsx']
    },
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
            },
            {
                test: /\.mustache$/,
                loader: 'mustache-loader'
            }
        ]
    },
    // Deduplicate code in chunks
    optimization: {
        splitChunks: {
            cacheGroups: {
                default: false,
                vendors: false,
                common: {
                    name: 'common',
                    minChunks: 2,
                    chunks: 'async',
                    priority: 10,
                    reuseExistingChunk: true,
                    enforce: true
                }
            }
        }
    }
};