var express         = require('express'),
  WebSocketServer   = require('websocket').server,
  http              = require('http'),
  Twitter           = require('twitter'),
  logger            = require('morgan'),
  bodyParser        = require('body-parser'),
  colors            = require('colors'),
  app               = express();

var server, wsServer;
var port = 3000;

//CONFIGURATION
colors.setTheme(require('./config/colorTheme.js'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(logger('combined', {
  skip: function (req, res) {
    return res.statusCode < 400;
  }
}));

//HTTP server used for the WebSocketServer as it doesn't support an Express server.
server = http.createServer(app);
server.listen(port, function () {
  console.log(new Date().toString().grey + ' Server is listening on port '.info + port.toString().info);
});

wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

var twitterCredentials = require('./config/twitterCredentials.js');
var twitterClients = [];
twitterClients.push(new Twitter(twitterCredentials[0]));
twitterClients.push(new Twitter(twitterCredentials[1]));

var websocketController = require('./controllers/websocketController');
websocketController.init(wsServer, twitterClients);

//ROUTES
require('./routes.js')(app, express);

