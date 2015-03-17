"use strict";

var subscribeToClock = function () {
  clockSubscriber = clockSubscription
    .subscribe(
      function (s) {
        redraw(s);
      },
      function (e) {
        console.log('onError: %s', e);
      },
      function () {
        console.log('onCompleted');
      }
    );
};
var unsubscribeFromClock = function () {
  clockSubscriber.dispose();
};
var clockInit = function () {
  clock = Rx.Observable.timer(
    0, /* 0 seconds */
    10 /* 200 ms */
  );
};
var initClockSubscription = function () {
  clockSubscription = clock.scan(initState(), function (state, time) {
    return state.update(time);
  });
};