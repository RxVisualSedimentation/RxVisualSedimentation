function TweetObservable() {
  var connection = initWebsocket();
  
  connection.onopen = function () {
    console.log("Connection successfully opened");
  }
  
  function topicOnNext(tuple) {
    var message = {};

    if(tuple.current!==""){
      message.action = "subscribe_topic";
      message.payload = tuple.current;
      connection.send(JSON.stringify(message)) 
    }
    message.action = "unsubscribe_topic";
    message.payload = tuple.last;
    connection.send(JSON.stringify(message)) 

  }
  
  inputObservables.topic1
  .subscribe(topicOnNext,
    function (err) {
      console.log('error: ' + err);
    },
    function () {
      console.log("Topic update stream completed.");
    }
  );
  inputObservables.topic2
    .subscribe(topicOnNext,
    function (err) {
      console.log('error: ' + err);
    },
    function () {
      console.log("Topic update stream completed.");
    }
  );
  inputObservables.topic3
    .subscribe(topicOnNext,
    function (err) {
      console.log('error: ' + err);
    },
    function () {
      console.log("Topic update stream completed.");
    }
  );
  inputObservables.topic4
    .subscribe(topicOnNext,
    function (err) {
      console.log('error: ' + err);
    },
    function () {
      console.log("Topic update stream completed.");
    }
  );

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
