module.exports.init = function (server, twitterClient) {
  server.on('request', function (request) {
    if (!originIsAllowed(request.origin)) {
      request.reject();
      console.log(new Date().toString().grey + ' Connection from origin ' + request.origin + ' rejected.'.red);
      return;
    }

    var connection = request.accept('twitter-protocol', request.origin);
    console.log(new Date().toString().grey+ " " + connection.remoteAddress + ' Connection accepted.'.green);

    twitterClient.stream('statuses/filter', {track: 'software'}, function(stream) {
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
      console.log(new Date().toString().grey + " "+ connection.remoteAddress + ' Disconnected.'.yellow);
    });
  });
};

function originIsAllowed(origin) {
  return "http://localhost:3000" === origin;
}