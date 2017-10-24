const AWS = require('aws-sdk');

AWS.config.update({region: process.env.Region});

const kms = new AWS.KMS();

const generatePolicy = function (effect, resource, user = 'user')
{
    return {
        principalId: user,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource
            }]
        }
    };
};

// Thanks http://www.javascripter.net/faq/readingacookie.htm
const parseCookie = function (cookieHeader, cookieName)
{
    const re = new RegExp('[; ]' + cookieName + '=([^\\s;]*)');
    const sMatch = (' ' + cookieHeader).match(re);
    return (cookieName && sMatch) ? decodeURIComponent(sMatch[1]) : '';
};

exports.handler = (event, context, callback) =>
{
    // Get token (as relayed from the cookie header)
    const authToken = parseCookie(event.authorizationToken, 'token');

    // Decode base64 string and initialize buffer with contents
    const token = Buffer.from(authToken, 'base64');

    // Deny request if cookie is missing or malformed
    if (token.length <= 64) {
        return callback(null, generatePolicy('Deny', event.methodArn));
    }

    // Get first 64 bytes of Buffer (which contains the salt)
    const salt = token.slice(0, 64);

    // Get rest of the bytes in the Buffer (which contains the encrypted value)
    const encrypted = token.slice(64);

    // Decrypt the encrypted salt via KMS
    kms.decrypt({
        CiphertextBlob: encrypted
    }, (err, data) =>
    {
        // Log error
        if (err) { console.log('kms.decrypt ERROR', err); }

        try {
            const value = data.Plaintext;
            const now = new Date();
            const expireDate = new Date(value.slice(0, 24).toString('utf8'));
            const decryptedSalt = value.slice(24);

            // Deny request if the salt does not match the decrypted salt or if the token has expired
            if (err || !salt.equals(decryptedSalt) || now > expireDate) {
                return callback(null, generatePolicy('Deny', event.methodArn));
            }

            // Allow request; specify wildcard resource (allows invoking any method) so that future requests for
            // resources using this cached policy are also allowed.
            //  Thanks https://forums.aws.amazon.com/message.jspa?messageID=708024#710207
            callback(null, generatePolicy('Allow', '*'));
        }
        catch (e) {
            console.log('Invalid token ERROR', e);
            return callback(e);
        }
    });
};
