var topicStreams = [];
var twitterClientList;
var users = [];

module.exports.init = function (server, twitterClients) {
  twitterClientList = twitterClients;
  server.on('request', function (request) {
    if (!originIsAllowed(request.origin)) {
      request.reject();
      console.log(new Date().toString().grey + ' Connection from origin ' + request.origin + ' rejected.'.red);
      return;
    }

    var connection = request.accept('twitter-protocol', request.origin);
    console.log(new Date().toString().grey + " " + connection.remoteAddress + ' Connection accepted.'.green);
    connection.on('message', function (message) {
      if (message.type === 'utf8') {
        console.log('Received Message: '.info + message.utf8Data.info);
        parseActions(message.utf8Data, connection);
      }
    });

    connection.on('close', function (reasonCode, description) {
      topicStreams.forEach(function (stream) {
        stream.destroy();
      });
      console.log(new Date().toString().grey + " " + connection.remoteAddress + ' Disconnected.'.yellow);
    });
  });
};

var parseActions = function (message, connection) {
  var actionMessage = JSON.parse(message);
  var clientAddress = connection.remoteAddress;
  if (actionMessage.action) {
    switch (actionMessage.action) {
      case 'subscribe_topic':
        console.log("Subscribing client(".info + clientAddress + ") to topic stream '".info + actionMessage.payload.yellow + "'.".info);
        subscribeTopic(actionMessage.payload, connection);
        break;
      case "unsubscribe_topic":
        console.log("Unsubscribing client(".info + clientAddress + ") from topic stream '".info + actionMessage.payload.yellow + "'.".info);
        unsubscribeTopic(actionMessage.payload, connection);
        break;
      case "register_user":
        var user = { id: users.length+1, team: requestNewTeam()};
        console.log("Registering user ".info + JSON.stringify(user) + ".".info);
        var response = { action:"user_registration", payload: user};
        users.push(user);
        connection.send(JSON.stringify(response));
        break;
      case "button_war_click":
        var user = actionMessage.payload;
        console.log("User " + user.id + " clicked for team " + user.team + ".");
        break;
      default:
        console.log(actionMessage);
    }
  } else {
    console.log(actionMessage);
  }
}

var requestNewTeam = function(){
  var teamCounts = [0,0]
  users.map(function(u){
    teamCounts[u.team]+=1;
  });
  console.log("Team Counts: " + JSON.stringify(teamCounts));
  console.log("Users: " + JSON.stringify(users));
  var minIndex = 0;
  teamCounts.map(function(value, index){
    if(value < teamCounts[minIndex]){
      minIndex = index;
    }
  });
  return minIndex;
}

var subscribeTopic = function (topic, connection) {
  var currentStream = null;
  var twitter = topicStreams.length < 2 ? twitterClientList[0] : twitterClientList[1];
  twitter.stream('statuses/filter', {track: topic}, function (stream) {
    stream.on('data', function (tweet) {
      tweet.topic = topic;
      connection.sendUTF(JSON.stringify(tweet));
    });
    stream.on('error', function (error) {
      console.log(error);
    });
    currentStream = stream;
  });
  currentStream.topic = topic;
  topicStreams.push(currentStream);
}

var unsubscribeTopic = function (topic) {
  topicStreams.filter(function (stream) {
    return stream.topic === topic;
  }).forEach(function(stream) {
    stream.destroy();
  })
}

function originIsAllowed(origin) {
  return "http://localhost:3000" === origin;
}
