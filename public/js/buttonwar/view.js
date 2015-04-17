var initButtons = function () {
  var clicks = 0;
  var green = 255;
  var red = 0;
  Rx.Observable.fromEvent($('#clickButton'), 'click')
    .subscribe(
    function (evt) {
      connection.send(JSON.stringify({action: "button_war_click", payload: user}));
      if(red+15<=255){
        red += 15;
      }else if(green-15>=0) {
        green -= 15;
      }
      $('#clickButton').css("background-color", "rgb(" + red + "," + green + ",0)");
    },
    function (err) {
      console.log('error: ' + err);
    },
    function () {
      console.log("Clock subscribe stream completed.");
    }
  );
  Rx.Observable.timer(
    0, /* 0 seconds */
    100 /* 25 ms */
  ).subscribe(
    function (evt) {
      if(green+5<=255) {
        green += 5;
      } else if(red-5>=0){
        red -= 5;
      }
      $('#clickButton').css("background-color", "rgb(" + red + "," + green + ",0)");
    },
    function (err) {
      console.log('error: ' + err);
    },
    function () {
      console.log("Clock subscribe stream completed.");
    });
}