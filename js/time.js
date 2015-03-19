"use strict";

var clock;
var clockSubscription;
var clockSubscriber;

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
    10 /* 25 ms */
  );
};

var initClockSubscription = function () {
  clockSubscription =
    clock
      .map(function () {
        return 1;
      })
      .scan(initState(), function (state, dt) {
        return state.update(dt);
      });
};
