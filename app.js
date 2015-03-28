var express     = require('express'),
  logger        = require('morgan'),
  bodyParser    = require('body-parser'),
  cookieParser  = require('cookie-parser'),
  path          = require('path'),
  flash         = require('connect-flash'),
  app           = express(),
  session       = require('express-session'),
  passport      = require('passport'),
  connection    = require('express-myconnection'),
  twitter    = require('ntwitter'),
  request       = require('request');

app.use(cookieParser());
app.use(bodyParser());
app.use(logger('combined'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use('/static',  express.static(__dirname + '/static'));
app.use('/fonts',  express.static(__dirname + '/bower_components/bootstrap/fonts/'));
app.use(flash());

app.use('/ext',  express.static(__dirname + '/ext'));
app.use('/css',  express.static(__dirname + '/css'));
app.use('/js',  express.static(__dirname + '/js'));

app.get('/', function(req,res){
  res.sendfile("index.html");
});

var tweets = [];
var tweetstream;
var twit;
var initTwitter = function (){
  twit = new twitter({
    consumer_key: 'aN6sH5wLED0dUxcZk1fiew',
    consumer_secret: '6Z9a5pE53Ni7A17fAcDqJhYY0HQHYsAH7yh9136pxI',
    access_token_key: '549297698-ORFxUNF9OW6XMBxCrTdk9JtG20JPguVRTeDhWYCN',
    access_token_secret: 'rafR3yUujzZfZbE8Vw9gYDOx0BaPpzzV540lZaTeS8'
  });
};

var startTweetStream = function (subject){
  twit.stream('statuses/filter', {'track': subject}, function(stream) {
    tweetstream = stream;
    stream.on('data', function (data) {
      tweets.push({time : data.time, text : data.text});
    });
  });
};

app.get('/tweets/start/:subject', function(req,res)
{
  initTwitter();
  startTweetStream(req.params.subject);
  res.send(req.params.subject);
});

app.get('/tweets/get', function(req,res)
{
  res.json(tweets);
  tweets = [];
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port)
});
