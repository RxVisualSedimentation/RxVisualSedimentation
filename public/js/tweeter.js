var initTweetObservable = function () {
  var connection = initWebsocket();
  
  connection.onopen = function () {
    console.log("Connection succesfully opened");
  }

  //The function given as parameter to create will only get executed when subscribe is called on tweetObservable.
  var tweetObservable = Rx.Observable.create(function (observer) {
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

  tweetObservable.subscribe(
    function (message) {
      try {
        var tweet = JSON.parse(message.data);
      } catch (e) {
        console.log('This doesn\'t look like a valid JSON: ', message.data);
        return;
      }
      console.log(tweet.created_at + " - " + tweet.user.name);
    },
    function (error) {
      console.log("Error occurred: ");
      console.log(error.toString());
    },
    function () {
      console.log('Completed');
    }
  );  
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



//  input.keydown(function(e) {
//    if (e.keyCode === 13) {
//      var msg = $(this).val();
//      if (!msg) {
//        return;
//      }
//      // send the message as an ordinary text
//      connection.send(msg.toString());
//      $(this).val('');
//    }
//  });