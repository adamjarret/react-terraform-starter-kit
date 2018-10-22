const merge = require('webpack-merge');
const html = require('../dev/webpack-html');
const common = require('./webpack.common.js');
const templateParameters = require('./data/terraform_output.json');

module.exports = merge(common, {
    mode: 'production',
    output: {
        publicPath: templateParameters.bucket_url.value + '/public/'
    },
    plugins: [
        // render index.html template
        html({templateParameters}),
    ]
});
