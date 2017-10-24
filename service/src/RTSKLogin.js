const AWS = require('aws-sdk');
const crypto = require('crypto');
const util = require('util');

AWS.config.update({region: process.env.Region});

const kms = new AWS.KMS();

exports.handler = (event, context, callback) => {
    let body;

    try {
        body = JSON.parse(event.body);
    }
    catch (err) {
        console.log('JSON.parse ERROR', util.inspect(err));
        return callback(err);
    }

    // This implementation simply checks the "hard coded" password set in the environment variable (see lambda.tf)
    //  but this could be extended to accept a username and compare a password hash stored in a database or start
    //  an oath handshake.
    const plaintext = body.password.toLowerCase();
    if (plaintext !== process.env.Password) {
        return callback(null, {
            statusCode: 401,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({message: "Incorrect password"})
        })
    }

    // Expire token (and cookie) in 24 hours
    const expireDate = new Date(new Date().getTime() + 60 * 60 * 24 * 1000);
    const expireDateBuf = Buffer.from(expireDate.toISOString(), 'utf8');

    // Generate 64 random bytes to be used as salt
    crypto.randomBytes(64, (err, salt) => {
        if (err) {
            console.log('crypto.randomBytes ERROR', util.inspect(err));
            return callback(err);
        }

        // Sign the random bytes using the KMS key
        kms.encrypt({
                KeyId: process.env.KMSKeyId,
                Plaintext: Buffer.concat([expireDateBuf, salt])
            },
            (err, data) => {
                if (err) {
                    console.log('kms.encrypt ERROR', util.inspect(err));
                    return callback(err);
                }

                // Prepend the random bytes to the encrypted (signed) bytes
                const token = Buffer.concat([salt, data.CiphertextBlob]).toString('base64');

                // Respond with token in the request body and in the Set-Cookie header
                callback(null, {
                    statusCode: 200,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Credentials": true,
                        "Set-Cookie": `token=${encodeURIComponent(token)}; expires=${expireDate.toUTCString()}; path=/`
                    },
                    body: JSON.stringify({
                        token: token
                    })
                })
            }
        );
    });
};
