function checkCredentials(body, callback)
{
    // This implementation simply checks the "hard coded" password set in the environment variable (see lambda.tf)
    //  but this could be extended to accept a username and compare a password hash stored in a database, etc.
    callback(null, body.password === process.env.Password);
}

function respond200(token, expireDate, callback)
{
    // Respond with token in the request body and in the Set-Cookie header
    callback(null, {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
            'Set-Cookie': `token=${encodeURIComponent(token)}; expires=${expireDate.toUTCString()}; path=/`
        },
        body: JSON.stringify({
            token: token
        })
    });
}

function respond401(callback)
{
    callback(null, {
        statusCode: 401,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

exports.checkCredentials = checkCredentials;

exports.respond200 = respond200;

exports.respond401 = respond401;
