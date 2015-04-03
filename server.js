var express         = require('express'),
  WebSocketServer   = require('websocket').server,
  http              = require('http'),
  logger            = require('morgan'),
  bodyParser        = require('body-parser'),
  colors            = require('colors'),
  app               = express();

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

  var connection = request.accept('echo-protocol', request.origin);
  console.log((new Date())+ " " + connection.remoteAddress + ' Connection accepted.'.green);
  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      console.log('Received Message: ' + message.utf8Data);
      connection.sendUTF('reply: ' + message.utf8Data);
    }
  });

  connection.on('close', function (reasonCode, description) {
    console.log((new Date()) + " "+ connection.remoteAddress + ' Disconnected.'.yellow);
  });
});