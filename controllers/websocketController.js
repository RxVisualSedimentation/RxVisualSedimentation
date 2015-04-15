module.exports.init = function (server, twitterClient) {
  server.on('request', function (request) {
    if (!originIsAllowed(request.origin)) {
      request.reject();
      console.log(new Date().toString().grey + ' Connection from origin ' + request.origin + ' rejected.'.red);
      return;
    }

    var connection = request.accept('twitter-protocol', request.origin);
    console.log(new Date().toString().grey+ " " + connection.remoteAddress + ' Connection accepted.'.green);
    var currentStream;
    twitterClient.stream('statuses/filter', {track: 'clinton'}, function(stream) {
      stream.on('data', function(tweet) {
        connection.sendUTF(JSON.stringify(tweet));
      });
      stream.on('error', function(error) {
        console.log(error);
      });
      currentStream = stream;
    });

    connection.on('message', function (message) {
      if (message.type === 'utf8') {
        console.log('Received Message: '.info + message.utf8Data.info);
      }
    });

    connection.on('close', function (reasonCode, description) {
      currentStream.destroy();
      console.log(new Date().toString().grey + " "+ connection.remoteAddress + ' Disconnected.'.yellow);
    });
  });
};

function originIsAllowed(origin) {
  return "http://localhost:3000" === origin;
}