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
        observer.onNext({
          message: JSON.parse(message.utf8Data),
          connection: connection
        });
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
  }, function (m) {
    return m;
  }).subscribe(
    function (obs) {
      messageObservables[obs.key] = obs;
      obs.subscribe(
        function (x) {
          getOnNext(x)();
        },
        function (err) {
          console.log("Error in grouped message observable: ".red);
          console.log(err.toString().red);
        },
        function () {
          console.log("Handling a grouped observable completed".info);
        });
    },
    function (err) {
      console.log("Error in handling the grouped observables".red);
      console.log(err.toString().red);
    },
    function () {
      console.log("Handling the grouped observables completed".info);
    }
  );
};

var getOnNext = function (request) {
  var actionMessage = request.message;
  var connection = request.connection;

  if (actionMessage.action) {
    switch (actionMessage.action) {
    case 'subscribe_topic':
      //onNext for subscribe topic message
      return function () {
        console.log("Subscribing client(".info + connection.remoteAddress + ") to topic stream '".info + actionMessage.payload.yellow + "'.".info);
        subscribeTopic(actionMessage.payload, connection);
      };
    case "unsubscribe_topic":
      //onNext for unsubscribe topic message
      return function () {
        console.log("Unsubscribing client(".info + connection.remoteAddress + ") from topic stream '".info + actionMessage.payload.yellow + "'.".info);
        unsubscribeTopic(actionMessage.payload, connection);
      };
    case "register_user":
      //onNext to register a new user for ButtonWars
      return function () {
        var user = {
          id: users.length + 1,
          team: requestNewTeam()
        };
        console.log("Registering user ".info + JSON.stringify(user) + ".".info);
        var response = {
          action: "user_registration",
          payload: user
        };
        users.push(user);
        connection.send(JSON.stringify(response));
      };
    case "button_war_click":
        //Subscribing will be done when a topic is subscribed.
        return function(){};
    default:
      //onNext in case of unknown action
      return function () {
        console.log("Unknown message action: ".red + actionMessage);
      }
    }
  }
  //onNext in case of missing action
  return function () {
    console.log("No action supplied: ".red + actionMessage);
  };
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
  if (topic.indexOf("Team") === 0 && messageObservables["button_war_click"]) {
    currentStream = messageObservables["button_war_click"];
    currentStream = currentStream.subscribe(function (x) {
      if (topic.substring(4) == x.message.payload.team) {
        var m = x.message;
        m.topic = topic;
        console.log(JSON.stringify(m));
        console.log("User " + m.payload.id + " clicked for team " + m.payload.team + ".");
        connection.sendUTF(JSON.stringify(m))
      }
    });
    currentStream.destroy = function () {}
  } else {
    var twitter = topicStreams.length < 2 ? twitterClientList[0] : twitterClientList[1];
    twitter.stream('statuses/filter', {
      track: topic
    }, function (stream) {
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