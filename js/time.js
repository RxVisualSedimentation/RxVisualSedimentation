"use strict";

var clock;
var clockSubscription;
var clockSubscriber;
var tweetObserver;

var tweets;

/**
 * Subscribe to the clock subscription.
 */
var subscribeToClock = function () {
  subscribeToTweets();
  if(clockSubscriber != null) {
    return;
  }
  clockSubscriber = clockSubscription
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
var unsubscribeFromClock = function () {
  if(clockSubscriber != null) {
    clockSubscriber.dispose();
    clockSubscriber = null;
  }
};

/**
 * Initialize the clock observable.
 */
var clockInit = function () {
  clock = Rx.Observable.timer(
    0, /* 0 seconds */
    20 /* 25 ms */
  );
};

/**
 * Initialize the clock subscription.
 */
var initClockSubscription = function () {
  clockSubscription =
    clock
      .map(function () {
        return 1;
      })
      .scan(initState(), function (state, dt) {
        return state.update(dt,tweets);
      });
};
