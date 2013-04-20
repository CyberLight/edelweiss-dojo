
/*
 * GET home page.
 */

var __ = require('underscore')._,
    messages = require('../config/messages').messages,
    utils = require('../shared/utils').utils,
    // in memory db implementation for testing purposes
    db = (function (u)
    {
        var entities = [],
        save = function (entity)
        {
            entities.push(entity);
        },
        find = function (entity)
        {
            var result = u.where(entities, { email: entity.email, password: entity.password });
            return result;
        };

        return {
            save: save,
            find: find
        }
    })(__);

function EntityValidator(propNames, lang, form){
    var validate = function (entity) {
        for (var i = 0; i < propNames.length; i++) {
            var propName = propNames[i];
            if (!entity.hasOwnProperty(propName)) {
                var messageData = messages[lang][form].entityHasNotProperty;
                return { success: false,
                    message: utils.format(messageData, propName)
                }
            }
        }
        return { success: true, message: "" };
    };
       return {
          isValid : validate
       }
}


exports.index = function(req, res){
  res.render('index', { title: 'Edelweiss-Dojo' });
};

exports.api_register_user_post = function (req, res) {
    var formName = "register",
        registerValidator = new EntityValidator(['login', 'firstname', 'lastname', 'password', 'email'],
                                                req.lang,
                                                formName),
        localizedMsgs = messages[req.lang][formName];

    if (!req.is('json')) {
        res.send(400, {
            success: false,
            message: localizedMsgs.invalidDataFormat
        })
        return;
    }

    var entity = req.body,
            result;

    if (__.isEmpty(entity)) {
        res.send(400, {
            success: false,
            message: localizedMsgs.invalidData
        });
        return;
    }

    result = registerValidator.isValid(entity);

    if (!result.success) {
        res.send(400, result);
        return;
    }

    if (db.find(entity).length == 0) {
        db.save(req.body);
    } else {
        res.send(400);
        return;
    }

    res.send(200, {success : true, message : localizedMsgs.successfullyRegistered});
};

exports.api_signin_user_post = function (req, res) {

    var formName = "signin",
    entityValidator = new EntityValidator(['email', 'password'],
                                          req.lang,
                                          formName),
    localizedMsgs = messages[req.lang][formName];

    loginData = req.body;

    if (!req.is('json')) {
        res.send(400, {
            success: false,
            message: localizedMsgs.invalidDataFormat
        });
        return;
    }

    if (__.isEmpty(req.body)) {
        res.send(400, {
            success: false,
            message: localizedMsgs.invalidData
        })
        return;
    }

    var result = entityValidator.isValid(loginData);
    if (!result.success) {
        res.send(400, result);
        return;
    }

    if (db.find(loginData).length == 0) {
        res.send(401);
        return;
    }

    res.send(200);
};