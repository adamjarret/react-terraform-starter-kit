// This middleware provides a minimal facsimile of the endpoints that would be available if the project was
//  deployed to API Gateway. It is used by webpack-dev-server to provide a local development environment
//  that allows you browse to an instance of the client which is being served locally and log in.

const {checkCredentials, respond200, respond401} = require('../service/src/lib/auth');

module.exports = (app) => {

    // forward requests for private files to the correct local URL
    //  unlike the real infrastructure, these files will be accessible even if not logged in
    //  note: "stage" URL param is not optional b/c without it a forward is unnecessary
    app.get('/:stage/private/**', (req, res) => {
        req.url = req.url.replace(new RegExp(`^/${req.params.stage}`), '');
        app.handle(req, res);
    });

    // respond to POST requests to /api/login
    //  unlike the real environment, the token is not generated cryptographically and is never checked
    app.post('/:stage?/api/login', (req, res) => {

        const mockLambdaProxy = lambdaProxyIsh(res);

        const handleCheck = (error, isAuthenticated) => {
            if (error) { return mockLambdaProxy(error); }
            if (!isAuthenticated) { return respond401(mockLambdaProxy); }
            // Fake token, expire cookie in 24 hours
            respond200('12345', new Date(new Date().getTime() + 60 * 60 * 24 * 1000), mockLambdaProxy);
        };

        const data = [];
        req.on('data', (chunk) => data.push(chunk)).on('end', () => {
            try {
                const body = JSON.parse(data.join(''));
                checkCredentials(body, handleCheck);
            }
            catch (e) {
                mockLambdaProxy(e);
            }
        });
    });

    // write unhandled request info to console
    app.use((req, res, next) => {
        console.error('Unhandled Request:', req.method, req.url);
        next();
    });
};

function lambdaProxyIsh(response)
{
    return (error, info) => {
        info = info || {};
        const body = info.body || '';
        response.writeHead(error ? 500 : info.statusCode, info.headers || {
            'Content-Type': 'application/json'
        });
        response.end(error ? JSON.stringify({message: error.message}) : body);
    };
}