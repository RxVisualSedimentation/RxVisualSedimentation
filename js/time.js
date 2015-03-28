"use strict";

var tweets;
var clockObservable;
var stateObservable;
var clockObserver;
var tweetObserver;

/**
 * Subscribe to the clock subscription.
 */
var subscribeToClockObservable = function () {
  subscribeToTweets();
  if(clockObserver != null) {
    return;
  }
  clockObserver = stateObservable
    .subscribe(
      function (s) {
        tweets = null;
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
 * Subscribe to the clock subscription.
 */
var subscribeToTweets = function () {
  clock.filter(function(t){
    return t%5 === 0;
  }).subscribe(function (s) {
      $.ajax( "http://localhost:3000/tweets/get" )
        .done(function(msg) {
          tweets = msg;
        })
        .fail(function() {
          console.log( "error" );
        })
        .always(function() {
          //console.log( "complete" );
        });
    },
    function (e) {
      console.log('onError: %s', e);
    },
    function () {
      console.log('onCompleted');
    });
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
      .scan(initState(), function (state, dt) {
        return state.update(dt,tweets);
      });
};
