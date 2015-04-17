var user;

var buttonObserver = new ButtonWarObservable().subscribe(
  function (message) {
    try {
      var actionMessage = JSON.parse(message.data);
      if(actionMessage.action){
        if(actionMessage.action === "user_registration"){
          $('#team').text('Team ' + actionMessage.payload.team);
          user = actionMessage.payload;
        }
      }
      console.log(JSON.parse(message.data));
    } catch (e) {
      console.log('This doesn\'t look like a valid JSON: ', message.data);
      return;
    }
  },
  function (error) {
    console.log("Error occurred: ");
    console.log(error.toString());
  },
  function () {
    console.log('Completed');
  }
);

var init = function(){
  initWebsocket();
  initButtons();
}