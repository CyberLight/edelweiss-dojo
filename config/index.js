var  middleware = require('./middleware'),
     routing = require('./routing');

exports.setup = function(app, config){
   middleware.setup(app, config);
   routing.setup(app, config);
};