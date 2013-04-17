var routes = require('../routes');

function setupRouting(app){
    app.use(app.router);
    app.get('/', routes.index);

    //service api route binding
    app.post('/api/register', routes.api_register_user_post);
    app.post('/api/signin', routes.api_signin_user_post);
}

exports.setup = setupRouting;