var initWebsocket = function () {
  window.WebSocket = window.WebSocket || window.MozWebSocket;

  var connection = new WebSocket('ws://127.0.0.1:3000/', 'twitter-protocol');

  if (!window.WebSocket) {
    console.log("Your browser does not support websockets");
    return;
  } 

  connection.onopen = function () {
    console.log("Connection succesfully opened");
  }

  connection.onerror = function (error) { 
    console.log("Error occurred: ");
    console.log(error.toString());
  }

  connection.onmessage = function (message) {
    try {
      var tweet = JSON.parse(message.data);
    } catch (e) {
      console.log('This doesn\'t look like a valid JSON: ', message.data);
      return;
    }
    console.log(tweet.created_at + " - " + tweet.user.name);
  }  
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