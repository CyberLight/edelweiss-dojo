
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , configuration = require('./config');

module.exports = main;

function main(config){
    var app = express();
    configuration.setup(app, config);
    return app;
}

if (module === require.main) {
    var config = require('./package.json').publicConfig;
    var app = main(config);
    app.listen(config.http_port);
    console.log("Listening on", config.http_port);
}

