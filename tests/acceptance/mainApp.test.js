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

describe('Main page', function(){
    describe('GET /', function(){
        it('should return 200 status', function(done){
            agent.get(HTTP_APP_URL).end(function(err, res){
                  res.status.should.be.equal(200);
                  done();
              });
        });

        it('should render page with title "Edelweiss-Dojo"', function(done){
            agent.get(HTTP_APP_URL).end(function(err, res){
                var $ = cheerio.load(res.text);
                $('title').text().should.be.equal('Edelweiss-Dojo');
                done();
            });
        });
    });
});





