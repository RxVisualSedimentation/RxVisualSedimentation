$(function () {
  var content = $('#content');
  var input = $('#input');
  var status = $('#status');
  
  window.WebSocket = window.WebSocket || window.MozWebSocket;
  
  var connection = new WebSocket('ws://127.0.0.1:3000/', 'echo-protocol');
  
  if (!window.WebSocket) {
    console.log("Your browser does not support websockets");
    return;
  } 
  
  connection.onopen = function () {
    console.log("Connection succesfully opened");
    connection.send("testje");
  }
  
  connection.onerror = function (error) { 
    console.log("Error occurred: ");
    console.log(error.toString());
  }
  
  connection.onmessage = function (message) {
    console.log("message received: " + message.data);
  }
  
  input.keydown(function(e) {
    if (e.keyCode === 13) {
      var msg = $(this).val();
      if (!msg) {
        return;
      }
      // send the message as an ordinary text
      connection.send(msg.toString());
      $(this).val('');
    }
  });  
});