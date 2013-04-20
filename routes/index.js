
/*
 * GET home page.
 */

var __ = require('underscore')._,
    // in memory db implementation for testing purposes
    db = (function(u){ 
        var entities = [],
        save = function(entity){
            entities.push(entity);
        },
        find = function(entity){
           return u.where(entities, entity);
        };
        return {
            save : save,
            find : find
        }
    })(__);


function isEmpty(map) {
    for(var key in map) {
        if (map.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

function EntityValidator(propNames){
      var validate = function(entity){
           for(var i = 0; i < propNames.length; i++){
              var propName = propNames[i];
              if(!entity.hasOwnProperty(propName)){
                  return { success : false,
                           message : "Entity hasn't property '" + propName + "'" }
              }
           }
           return { success : true, message : "" };
       };
       return {
          isValid : validate
       }
}


exports.index = function(req, res){
  res.render('index', { title: 'Edelweiss-Dojo' });
};

exports.api_register_user_post = function(req, res){
    var registerValidator = new EntityValidator(['login','firstname','lastname','password','email']);
    if(req.is('json')){
        var entity = req.body,
            result = registerValidator.isValid(entity);
        if(isEmpty(entity) || !result.success){
            res.send(400, result);
            return;
        }
        if(db.find(entity).length == 0){
            db.save(req.body);
        }else{
            res.send(400);
            return;
        }
    }
    res.send(200);
};

exports.api_signin_user_post = function(req, res){
    var validUser = { email : 'testuser@email.ru', password : 'testPassword'},
        entityValidator = new EntityValidator(['email', 'password']);
        loginData = req.body;

    if(!req.is('json')){
        res.send(400, { message : 'Invalid format of data'});
        return;
    }

    var result = entityValidator.isValid(loginData);
    if(!result.success){
        res.send(400, result);
        return;
    }

    if(loginData.email !== validUser.email
        || loginData.password !== validUser.password){

        res.send(401);
        return;
    }
    res.send(200);
};