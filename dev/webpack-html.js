const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (options) => {
    return new HtmlWebpackPlugin(Object.assign({
        template: 'client/index.mustache'
    }, options));
};