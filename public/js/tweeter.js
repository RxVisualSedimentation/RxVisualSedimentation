function TweetObservable() {
  var connection = initWebsocket();
  
  connection.onopen = function () {
    console.log("Connection successfully opened");
    connection.send(JSON.stringify(messageAction1));
    connection.send(JSON.stringify(messageAction2));
  }

  //The function given as parameter to create will only get executed when subscribe is called on tweetObservable.
  return Rx.Observable.create(function (observer) {
    connection.onmessage = function (message) {
      observer.onNext(message);
    }

    connection.onerror = function (error) {
      observer.onError(error);
    }

    connection.onclose = function () {
      observer.onCompleted();
    }
  }); 
}

var initWebsocket = function () {
  window.WebSocket = window.WebSocket || window.MozWebSocket;

  var connection = new WebSocket('ws://127.0.0.1:3000/', 'twitter-protocol');

  if (!window.WebSocket) {
    console.log("Your browser does not support websockets");
    return;
  }
  return connection;  
}

var messageAction1 = {
  "action": "subscribe_topic",
  "payload": "Twitter"
};
var messageAction2 = {
  "action": "subscribe_topic",
  "payload": "Obama"
};