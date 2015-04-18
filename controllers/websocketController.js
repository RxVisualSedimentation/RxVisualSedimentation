var Rx = require('rx')

var topicStreams = [];
var twitterClientList;
var users = [];
var messageObservables = {};
var conn;

module.exports.init = function (server, twitterClients) {
  twitterClientList = twitterClients;
  var messageStream = Rx.Observable.create(function (observer) {
    server.on('request', function (request) {
      if (!originIsAllowed(request.origin)) {
        request.reject();
        console.log(new Date().toString().grey + ' Connection from origin ' + request.origin + ' rejected.'.red);
        return;
      }

      var connection = request.accept('twitter-protocol', request.origin);
      conn = connection;
      console.log(new Date().toString().grey + " " + connection.remoteAddress + ' Connection accepted.'.green);
      connection.on('message', function (message) {
        observer.onNext({message: JSON.parse(message.utf8Data), connection : connection});
      });

      connection.on('close', function (reasonCode, description) {
        topicStreams.forEach(function (stream) {
          stream.destroy();
        });
        observer.onCompleted();
        console.log(new Date().toString().grey + " " + connection.remoteAddress + ' Disconnected.'.yellow);
      });
    });
  }).groupBy(function (m) {
    return m.message.action;
  },function (m) {
    return m;
  }).subscribe(
    function (obs) {
      console.log(JSON.stringify(obs));
      obs.subscribe(function (x) {
        parseActions(x.message, x.connection);
      });
      messageObservables[obs.key] = obs;
      console.log(JSON.stringify(messageObservables));
    });
};


var parseActions = function (actionMessage, connection) {
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
        var user = {id: users.length + 1, team: requestNewTeam()};
        console.log("Registering user ".info + JSON.stringify(user) + ".".info);
        var response = {action: "user_registration", payload: user};
        users.push(user);
        connection.send(JSON.stringify(response));
        break;
      default:
        console.log(actionMessage);
    }
  } else {
    console.log(actionMessage);
  }
}

var requestNewTeam = function () {
  var teamCounts = [0, 0]
  users.map(function (u) {
    teamCounts[u.team] += 1;
  });
  console.log("Team Counts: " + JSON.stringify(teamCounts));
  console.log("Users: " + JSON.stringify(users));
  var minIndex = 0;
  teamCounts.map(function (value, index) {
    if (value < teamCounts[minIndex]) {
      minIndex = index;
    }
  });
  return minIndex;
}

var subscribeTopic = function (topic, connection) {
  var currentStream = null;
  connection.sendUTF(JSON.stringify("zar"));
  if(topic=="Team0" && messageObservables["button_war_click"]) {
    currentStream = messageObservables["button_war_click"];
    console.log("Team0!!!!! - " + JSON.stringify(currentStream));
    currentStream = currentStream.subscribe(function(x){
      var m = x.message;
      m.topic = topic;
      console.log(JSON.stringify(m));
      console.log("User " + m.payload.id + " clicked for team " + m.payload.team + ".");
      connection.sendUTF(JSON.stringify(m))
    });
    currentStream.destroy = function(){
      //messageObservables["button_war_click"].dispose();
    }
  } else {
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
  }
  currentStream.topic = topic;
  topicStreams.push(currentStream);
}

var unsubscribeTopic = function (topic) {
  topicStreams.filter(function (stream) {
    return stream.topic === topic;
  }).forEach(function (stream) {
    stream.destroy();
  })
}

function originIsAllowed(origin) {
  return "http://localhost:3000" === origin;
}
