var topicStreams = [];
var twitter;

module.exports.init = function (server, twitterClient) {
  twitter = twitterClient;
  server.on('request', function (request) {
    if (!originIsAllowed(request.origin)) {
      request.reject();
      console.log(new Date().toString().grey + ' Connection from origin ' + request.origin + ' rejected.'.red);
      return;
    }

    var connection = request.accept('twitter-protocol', request.origin);
    console.log(new Date().toString().grey+ " " + connection.remoteAddress + ' Connection accepted.'.green);
    connection.on('message', function (message) {
      if (message.type === 'utf8') {
        console.log('Received Message: '.info + message.utf8Data.info);
        parseActions(message.utf8Data, connection);
      }
    });

    connection.on('close', function (reasonCode, description) {
      topicStreams.forEach(function (stream){
        stream.destroy();
      });
      console.log(new Date().toString().grey + " "+ connection.remoteAddress + ' Disconnected.'.yellow);
    });
  });
};

var parseActions = function(message, connection){
  var actionMessage = JSON.parse(message);
  var clientAddress = connection.remoteAddress;
  switch (actionMessage.action) {
    case 'subscribe_topic':
      console.log("Subscribing client(".info + clientAddress + ") to topic stream '".info + actionMessage.payload.yellow + "'.".info);
      subscribeTopic(actionMessage.payload, connection);
      break;
    case "unsubscribe_topic":
      console.log("Unsubscribing client(".info + clientAddress + ") from topic stream '".info + actionMessage.payload.yellow + "'.".info);
      unsubscribeTopic(actionMessage.payload, connection);
      break;
  }
}

var subscribeTopic = function(topic, connection){
  var currentStream = null;
  twitter.stream('statuses/filter', {track: topic}, function(stream) {
    stream.on('data', function(tweet) {
      tweet.topic = topic;
      connection.sendUTF(JSON.stringify(tweet));
    });
    stream.on('error', function(error) {
      console.log(error);
    });
    currentStream = stream;
  });
  currentStream.topic = topic;
  topicStreams.push(currentStream);
}

var unsubscribeTopic = function(topic){
  topicStreams.filter(function(stream){
    return stream.topic === topic;
  }).forEach(function(stream){
    stream.destroy;
  })
}

function originIsAllowed(origin) {
  return "http://localhost:3000" === origin;
}