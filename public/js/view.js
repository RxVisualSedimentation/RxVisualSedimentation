"use strict";

var svg;
var w = 800,
  h = 600;

/**
 * Initialize the environment.
 */
var initEnvironment = function () {
  "use strict";
  svg = d3.select("#environment").insert("svg").attr("width", w).attr("height", h);
};

/**
 * Redraw the current state. Actually modifies the svg elements.
 * @param state - Apply the changes of the given state in the current canvas.
 */
var redraw = function (state) {
  state.bodies
    .map(function (body) {
      body.renderSVG();
    });
};

/**
 * Initialize all the buttons on the page.
 */
var initButtons = function () {
  Rx.Observable.fromEvent($('#subscribeClock'), 'click')
    .subscribe(
      function (evt) {
        $('#subscribeClock').addClass('disabled');
        $('#unsubscribeClock').removeClass('disabled');
        subscribeToClockObservable();
      },
      function (err) {
        console.log('error: ' + err);
      },
      function () {
        console.log("completed subscribe to clock");
      }
    );
  
  Rx.Observable.fromEvent($('#unsubscribeClock'), 'click')
    .subscribe(
      function (evt) {
        unsubscribeFromClockObservable();
        $('#subscribeClock').removeClass('disabled');
        $('#unsubscribeClock').addClass('disabled');
      },
      function (err) {
        console.log('error: ' + err);
      },
      function () {
        console.log("completed unsubscribe to clock");
      }
    );
};