var express         = require('express'),
  WebSocketServer   = require('websocket').server,
  http              = require('http'),  
  Twitter           = require('twitter'),
  logger            = require('morgan'),
  bodyParser        = require('body-parser'),
  colors            = require('colors'),    
  app               = express();

var twitterCredentials = require('./config/twitterCredentials.js');

colors.setTheme({
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  debug: 'cyan',
  warn: 'orange',
  error: 'red'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(logger('combined', {
  skip: function (req, res) {
    return res.statusCode < 400
  }
}));

app.use('/ext', express.static(__dirname + '/ext'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/websocket.html");
});

var client = new Twitter(twitterCredentials);

var server = http.createServer(app);
server.listen(3000, function () {
  console.log((new Date()) + ' Server is listening on port 3000');
});

wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

function originIsAllowed(origin) {
  return "http://localhost:3000" === origin;
}

wsServer.on('request', function (request) {
  if (!originIsAllowed(request.origin)) {
    request.reject();
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.'.red);
    return;
  }

  var connection = request.accept('twitter-protocol', request.origin);
  console.log((new Date())+ " " + connection.remoteAddress + ' Connection accepted.'.green);
  
  client.stream('statuses/filter', {track: 'software'}, function(stream) {
    stream.on('data', function(tweet) {
      connection.sendUTF(JSON.stringify(tweet));
    });
    stream.on('error', function(error) {
      console.log(error.toString().error);
    });
  });
  
  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      console.log('Received Message: '.info + message.utf8Data.info);
    }
  });

  connection.on('close', function (reasonCode, description) {
    console.log((new Date()) + " "+ connection.remoteAddress + ' Disconnected.'.yellow);
  });
});