const {bucket_name} = require('./client/data/terraform_output.json');

module.exports = {
    profile: 'default',
    region: 'us-east-1',
    origin: './bucket',
    destination: `s3://${bucket_name.value}`,
    ignore: /^\.|\/\./,
    concurrency: 3,
    delete: false
};

module.exports.schemaVersion = 1;
