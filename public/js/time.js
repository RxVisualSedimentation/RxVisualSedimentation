"use strict";

var clockObservable;
var stateObservable;
var clockObserver;

/**
 * Subscribe to the clock subscription.
 */
var subscribeToClockObservable = function () {
  if(clockObserver != null) {
    return;
  }
  clockObserver = stateObservable
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

/**
 * Unsubscribe from the clock subscription.
 */
var unsubscribeFromClockObservable = function () {
  if(clockObserver != null) {
    clockObserver.dispose();
    clockObserver = null;
  }
};

/**
 * Initialize the clock observable.
 */
var initClockObversable = function () {
  clockObservable = Rx.Observable.timer(
    0, /* 0 seconds */
    20 /* 25 ms */
  );
};

/**
 * Initialize the clock subscription.
 */
var initStateObservable = function () {
  stateObservable =
    clockObservable
      .map(function () {
        return 1;
      })
      .scan(State.init(), function (state, dt) {
        return state.update(dt);
      });
};
