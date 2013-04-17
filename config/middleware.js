var express = require('express'),
    path = require('path');

function setupMiddleware(app, config){
    app.set('views', __dirname + '/../views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(express.static(path.join(__dirname, '/../public')));

    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }
}

exports.setup = setupMiddleware;