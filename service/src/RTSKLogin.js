const AWS = require('aws-sdk');
const crypto = require('crypto');
const util = require('util');
const {checkCredentials, respond200, respond401} = require('./lib/auth');

AWS.config.update({region: process.env.Region});

const kms = new AWS.KMS();

exports.handler = (event, context, callback) => {

    const handleCheck = (error, isAuthenticated) => {

        if (error) { return callback(error); }

        if (!isAuthenticated) { return respond401(callback); }

        // Expire token (and cookie) in 24 hours
        const expireDate = new Date(new Date().getTime() + 60 * 60 * 24 * 1000);
        const expireDateBuf = Buffer.from(expireDate.toISOString(), 'utf8');

        // Generate 64 random bytes to be used as salt
        crypto.randomBytes(64, (error, salt) => {
            if (error) {
                console.log('crypto.randomBytes ERROR', util.inspect(error));
                return callback(error);
            }

            const params = {
                KeyId: process.env.KMSKeyId,
                Plaintext: Buffer.concat([expireDateBuf, salt])
            };

            // Sign the random bytes using the KMS key
            kms.encrypt(params, (err, data) => {
                if (err) {
                    console.log('kms.encrypt ERROR', util.inspect(err));
                    return callback(err);
                }

                // Prepend the random bytes to the signed (encrypted) bytes
                const token = Buffer.concat([salt, data.CiphertextBlob]).toString('base64');

                // Respond with token
                respond200(token, expireDate, callback);
            });
        });
    };

    // Parse JSON body (respond with status 500 if parse fails)
    try {
        const body = JSON.parse(event.body);
        // Respond with status 401 if password is incorrect
        checkCredentials(body, handleCheck);
    }
    catch (err) {
        console.log('JSON.parse ERROR', util.inspect(err));
        callback(err);
    }
};

