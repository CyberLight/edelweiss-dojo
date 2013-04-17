var routes = require('../routes');

function setupRouting(app, config){
    app.use(app.router);
    app.get('/', routes.index);

    //service api route binding
    app.post('/api/register', routes.api_register_user_post);
}

exports.setup = setupRouting;