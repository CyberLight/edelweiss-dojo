var PORT = 3030,
    HTTP_APP_URL = 'http://localhost:' + PORT;
    mocha = require('mocha'),
    superagent = require('superagent'),
    agent = superagent.agent(),
    cheerio = require('cheerio'),
    should = require('should'),
    async = require('async'),
    appStarter = require('../app.starter'),
    app = appStarter.startApp(PORT),
    validUser = {
        login: 'testlogin',
        firstname: 'firstname',
        lastname: 'lastmame',
        password : 'password',
        email : 'email@email.ru'
    };

before(function(){

});

function sendJsonData(url, data){
    return agent.post(HTTP_APP_URL + url)
                .type('json')
                .send(data)
}

function sendJsonDataFor(urls, data){
    return agent.post(HTTP_APP_URL + url)
        .type('json')
        .send(data)
}

function sendData(url, data){
    return agent.post(HTTP_APP_URL + url)
        .send(data)
}

describe('Edelweiss-Dojo service api tests', function ()
{
    describe('POST /', function ()
    {
        describe('Register user tests', function ()
        {
            it('should return 200 http status, after sent valid data', function (done)
            {
                sendJsonData('/api/register', validUser)
                    .end(function (err, res)
                    {
                        res.status.should.be.equal(200);
                        done();
                    });
            });

            it('should return 400 - Bad request after sent empty data', function (done)
            {
                sendJsonData('/api/register', {})
                    .end(function (err, res)
                    {
                        res.status.should.be.equal(400);
                        done();
                    });
            });

            it('should return 400 - Bad request with err message for not full entity data', function (done)
            {
                sendJsonData('/api/register',
                    {
                        login: 'testlogin',
                        lastname: 'lastname',
                        password: 'password',
                        email: 'email@email.ru'
                    })
                    .end(function (err, res)
                    {
                        res.status.should.be.equal(400);
                        res.body.message.should.be.include('firstname');
                        done();
                    });
            });

            it('should return 400 - bad request for trying register user twice', function (done)
            {
                var testUser =
                {
                    login: 'testlogin2',
                    firstname: 'firstname2',
                    lastname: 'lastname2',
                    password: 'password2',
                    email: 'email2@email.ru'
                };
                
                async.map([testUser, testUser],
                    function (data, callback)
                    {
                        sendJsonData('/api/register', data).end(function (err, res)
                        {
                            callback(null, res.status);
                        })
                    },
                    function (err, result)
                    {
                        result.should.eql([200, 400]);
                        done();
                    });
            });
        });

        describe('Sign In user tests', function ()
        {
            it('should return 200 for valid user credentials', function (done)
            {
                sendJsonData('/api/signin',
                    { email: 'testuser@email.ru', password: 'testPassword' }
                ).end(function (err, res)
                {
                    res.status.should.be.equal(200);
                    done();
                });
            });

            it('should return 401 for invalid user credentials', function (done)
            {
                sendJsonData('/api/signin',
                    { email: 'anonymous@email.ru', password: 'notvalidpassword' }
                ).end(function (err, res)
                {
                    res.status.should.be.equal(401);
                    done();
                });
            });

            it('should return 400 - Bad request for empty user credentials', function (done)
            {
                sendJsonData('/api/signin', {}
                ).end(function (err, res)
                {
                    res.status.should.be.equal(400);
                    done();
                });
            });

            it('should  return 400 - Bad request for not full credential json', function (done)
            {
                sendJsonData('/api/signin', { email: 'some@email.ru' }
                ).end(function (err, res)
                {
                    res.status.should.be.equal(400);
                    res.body.message.should.include("'password'");
                    done();
                });
            });

            it('should return 400 - Bad request for not json type of data', function (done)
            {
                sendData('/api/signin', '<email>testuser@email.ru</email><password>testPassword</password>'
                ).end(function (err, res)
                {
                    res.status.should.be.equal(400);
                    res.body.message.should.equal('Invalid format of data');
                    done();
                });
            })
        });
    });
});