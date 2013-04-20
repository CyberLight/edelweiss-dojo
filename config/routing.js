var routes = require('../routes');

function setupRouting(app){
    app.use(app.router);
    app.param('lang', function (req, res, next, id)
    {
        req.lang = id
        next();
    });
    app.get('/', routes.index);

    //service api route binding
    app.post('/api/:lang/register', routes.api_register_user_post);
    app.post('/api/:lang/signin', routes.api_signin_user_post);
}

exports.setup = setupRouting;