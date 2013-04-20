var PORT = 3030,
    HTTP_APP_URL = 'http://localhost:' + PORT,
    EN_REGISTER_URL = '/api/en/register',
    EN_SIGNIN_URL = '/api/en/signin',
    RU_SIGNIN_URL = '/api/ru/signin',
    RU_REGISTER_URL = '/api/ru/register',
    mocha = require('mocha'),
    superagent = require('superagent'),
    agent = superagent.agent(),
    cheerio = require('cheerio'),
    should = require('should'),
    async = require('async'),
    appStarter = require('../app.starter'),
    app = appStarter.startApp(PORT),
    messages = require('../../config/messages').messages,
    utils = require('../../shared/utils').utils;

before(function(){

});

function sendJsonData(url, data){
    return agent.post(HTTP_APP_URL + url)
                .type('json')
                .send(data)
}

function sendData(url, data){
    return agent.post(HTTP_APP_URL + url)
        .send(data)
}

function createUser(login, firstname, lastname, password, email)
{
    return {
        login: login,
        firstname : firstname,
        lastname: lastname,
        password : password,
        email : email
    };
}

describe('Edelweiss-Dojo service api tests', function () {
    describe('POST /', function () {
        describe('Register user tests', function () {
            it('should return 200 http status, after sent valid data', function (done) {
                var validUser = createUser('login1', 'firstname1', 'lastname1', 'password1', 'email1@mail.ru');
                sendJsonData(EN_REGISTER_URL, validUser)
                    .end(function (err, res) {
                        res.status.should.be.equal(200);
                        done();
                    });
            });

            it('should return 400 - Bad request after sent empty data', function (done) {
                sendJsonData(EN_REGISTER_URL, {})
                    .end(function (err, res) {
                        res.status.should.be.equal(400);
                        done();
                    });
            });

            it('should return 400 - Bad request with err message for not full entity data', function (done) {
                sendJsonData(EN_REGISTER_URL,
                    {
                        login: 'testlogin',
                        lastname: 'lastname',
                        password: 'password',
                        email: 'email@email.ru'
                    })
                    .end(function (err, res) {
                        res.status.should.be.equal(400);
                        res.body.message.should.be.include('firstname');
                        done();
                    });
            });

            it('should return 400 - bad request for trying register user twice', function (done) {
                var testUser = createUser('testlogin2',
                                          'firstname2',
                                          'lastname2',
                                          'password2',
                                          'email2@email.ru');

                async.map([testUser, testUser],
                    function (data, callback) {
                        sendJsonData(EN_REGISTER_URL, data).end(function (err, res) {
                            callback(null, res.status);
                        });
                    },
                    function (err, result) {
                        result.should.eql([200, 400]);
                        done();
                    });
            });
        });

        describe('Sign In user tests', function () {
            it('should return 200 for valid user credentials', function (done) {
                var user = createUser('testlogin3', 'firstname3', 'lastname3', 'testPassword3', 'testuser3@email.ru'),
                    loginData = { email: user.email, password: user.password };

                sendJsonData(EN_REGISTER_URL, user).end(function (err, res) {
                    sendJsonData(EN_SIGNIN_URL, loginData).end(function (err, res) {
                        res.status.should.be.equal(200);
                        done();
                    });
                });
            });

            it('should return 401 for invalid user credentials', function (done) {
                sendJsonData(EN_SIGNIN_URL, { email: 'anonymous@email.ru', password: 'notvalidpassword' })
                .end(function (err, res) {
                    res.status.should.be.equal(401);
                    done();
                });
            });

            it('should return 400 - Bad request for empty user credentials', function (done) {
                sendJsonData(EN_SIGNIN_URL, {})
                .end(function (err, res) {
                    res.status.should.be.equal(400);
                    done();
                });
            });

            it('should  return 400 - Bad request for not full credential json', function (done) {
                sendJsonData(EN_SIGNIN_URL, { email: 'some@email.ru' })
                .end(function (err, res) {
                    res.status.should.be.equal(400);
                    res.body.message.should.include("'password'");
                    done();
                });
            });

            it('should return 400 - Bad request for not json type of data', function (done) {
                sendData(EN_SIGNIN_URL, '<email>testuser@email.ru</email><password>testPassword</password>')
                .end(function (err, res) {
                    res.status.should.be.equal(400);
                    res.body.message.should.equal(messages.en.signin.invalidDataFormat);
                    done();
                });
            });

            it('should return 400 - Bad request for empty json body request', function (done) {
                var emptyJsonData = {};
                sendJsonData(EN_SIGNIN_URL, emptyJsonData).end(function (req, res) {
                    res.status.should.be.equal(400);
                    done();
                });
            });
        });
    });

    describe("POST /api/:lang/signin internationalization tests", function () {
        describe("/:lang/ = ru", function () {
            it("should return RU message for empty json body request", function (done) {
                var emptyJsonData = {};
                sendJsonData(RU_SIGNIN_URL, emptyJsonData).end(function (req, res) {
                    res.status.should.be.equal(400);
                    console.log(JSON.stringify(res.body));
                    res.body.message.should.be.equal(messages.ru.signin.invalidData);
                    done();
                });
            });

            it("should return RU message for not full filled user auth data", function (done) {
                var userAuthData = {
                    email: "login4@email.ru"
                };

                sendJsonData(RU_SIGNIN_URL, userAuthData)
                            .end(function (err, res) {
                                res.status.should.be.equal(400);
                                res.body.message.should.equal(utils.format(messages.ru.signin.entityHasNotProperty, 'password'));
                                done();
                            });
            });

            it("should return RU message for not Json data format", function (done) {
                sendData(RU_SIGNIN_URL, 'some text data').end(function (err, res) {
                    res.status.should.be.equal(400);
                    res.body.message.should.be.equal(messages.ru.signin.invalidDataFormat);
                    done();
                });
            });
        });

        describe("/:lang/ = en", function () {
            it("should return EN message for empty json body request", function (done) {
                var emptyJsonData = {};
                sendJsonData(EN_SIGNIN_URL, emptyJsonData).end(function (req, res) {
                    res.status.should.be.equal(400);
                    console.log(JSON.stringify(res.body));
                    res.body.message.should.be.equal(messages.en.signin.invalidData);
                    done();
                });
            });

            it("should return EN message for not full filled user auth data", function (done) {
                var userAuthData = {
                    email: "login4@email.ru"
                };

                sendJsonData(EN_SIGNIN_URL, userAuthData)
                            .end(function (err, res) {
                                res.status.should.be.equal(400);
                                res.body.message.should.equal(utils.format(messages.en.signin.entityHasNotProperty, 'password'));
                                done();
                            });
            });

            it("should return EN message for not Json data format", function (done) {
                sendData(EN_SIGNIN_URL, 'some text data').end(function (err, res) {
                    res.status.should.be.equal(400);
                    res.body.message.should.be.equal(messages.en.signin.invalidDataFormat);
                    done();
                });
            });
        });
    });

    describe("POST /api/:lang/register internationalization tests", function () {
        describe("/:lang/ = ru", function () {
            it("should return RU message for empty user registration data", function (done) {
                var regUserData = {};
                sendJsonData(RU_REGISTER_URL, regUserData)
                .end(function (err, res) {
                    res.status.should.be.equal(400);
                    res.body.message.should.equal(messages.ru.register.invalidData);
                    done();
                });
            });

            it("should return RU message for not full filled user reg data", function (done) {
                var regUserData = {
                    login: "login4",
                    email: "login4@email.ru",
                    firstname: "firstname4",
                    lastname: "lastname4"
                }

                sendJsonData(RU_REGISTER_URL, regUserData)
                            .end(function (err, res) {
                                res.status.should.be.equal(400);
                                res.body.message.should.equal(utils.format(messages.ru.register.entityHasNotProperty, 'password'));
                                done();
                            });
            });

            it("should return RU message for not Json data format", function (done) {
                sendData(RU_REGISTER_URL, 'some text data').end(function (err, res) {
                    res.status.should.be.equal(400);
                    res.body.message.should.be.equal(messages.ru.register.invalidDataFormat);
                    done();
                });
            });

            it("should return RU message after succesfull registration", function () {
                var validUserRegData = createUser('login6', 'firstname6', 'lastname6', 'password6', 'email6@email.ru');
                sendJsonData(RU_REGISTER_URL, validUserRegData).end(function (err, res) {
                    res.status.should.be.equal(200);
                    res.body.message.should.be.equal(messages.ru.register.successfullyRegistered);
                });
            });
        });

        describe("/:lang/ = en", function () {
            it("should return EN message for empty user registration data", function (done) {
                var regUserData = {};
                sendJsonData(EN_REGISTER_URL, regUserData)
                .end(function (err, res) {
                    res.status.should.be.equal(400);
                    res.body.message.should.equal(messages.en.register.invalidData);
                    done();
                });
            });

            it("should return EN message for not full filled user reg data", function (done) {
                var regUserData = {
                    login: "login5",
                    email: "login5@email.ru",
                    firstname: "firstname5",
                    lastname: "lastname5"
                }

                sendJsonData(EN_REGISTER_URL, regUserData)
                            .end(function (err, res) {
                                res.status.should.be.equal(400);
                                res.body.message.should.equal(utils.format(messages.en.register.entityHasNotProperty, 'password'));
                                done();
                            });
            });

            it("should return EN message for not Json data format", function (done) {
                sendData(EN_REGISTER_URL, 'some text data').end(function (err, res) {
                    res.status.should.be.equal(400);
                    res.body.message.should.be.equal(messages.en.register.invalidDataFormat);
                    done();
                });
            });
        });

    });
});