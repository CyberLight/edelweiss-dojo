module.exports = {
    startApp: function(port) {
        var config = require('../package.json').publicConfig;
        config.test = true;
        var app = require('../app')(config);
        return app.listen(port);
    }
};