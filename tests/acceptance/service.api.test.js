const PORT = 3030,
      HTTP_APP_URL = 'http://localhost:' + PORT;

var mocha = require('mocha'),
    superagent = require('superagent'),
    agent = superagent.agent(),
    cheerio = require('cheerio'),
    should = require('should'),
    appStarter = require('../app.starter'),
    app = appStarter.startApp(PORT);

before(function(){

});

function sendJsonData(url, data){
    return agent.post(HTTP_APP_URL + url)
                .type('json')
                .send(data)
}

describe('Edelweiss-Dojo service api tests', function(){
     describe('POST /', function(){
         describe('Register user tests', function(){
            it('should return 200 http status, after sent valid data', function(done){
                sendJsonData('/api/register',
                    {
                        login: 'testlogin',
                        firstname: 'firstname',
                        lastname: 'lastmame',
                        password : 'password',
                        email : 'email@email.ru'
                    })
                    .end(function(err, res){
                        res.status.should.be.equal(200);
                        done();
                     });
            });

            it('should return 400 - Bad request after sent empty data', function(done){
                sendJsonData('/api/register', {})
                    .end(function(err, res){
                        res.status.should.be.equal(400);
                        done();
                    });
            });

            it('should return 400 - Bad request with err message for not full entity data', function(done){
                sendJsonData('/api/register',
                    {
                        login: 'testlogin',
                        lastname: 'lastmame',
                        password : 'password',
                        email : 'email@email.ru'
                    })
                    .end(function(err, res){
                        res.status.should.be.equal(400);
                        res.body['message'].should.be.include('firstname');
                        done();
                    });
            });
         });
     });
});