
/*
 * GET home page.
 */

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
        var result = registerValidator.isValid(req.body);
        if(isEmpty(req.body) || !result.success){
            res.send(400, result);
            return;
        }
    }
    res.send(200);
};