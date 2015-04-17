"use strict";

var svg;
var inputObservables = {};
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
        console.log("Clock subscribe stream completed.");
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
        console.log("Clock unsubscribe stream completed.");
      }
    );
  
  //
  inputObservables.gravityX = Rx.Observable.fromEvent($('#gravityX'), 'change', function (evt) {
    return evt[0].target.value;
  });
  inputObservables.gravityY = Rx.Observable.fromEvent($('#gravityY'), 'change', function (evt) {
    return evt[0].target.value;
  });
  inputObservables.size = Rx.Observable.fromEvent($('#size'), 'change', function (evt) {
    return evt[0].target.value;
  });
  inputObservables.restitution = Rx.Observable.fromEvent($('#restitution'), 'change', function (evt) {
    return evt[0].target.value;
  });
  inputObservables.shrinking = Rx.Observable.fromEvent($('#shrinking'), 'change', function (evt) {
    return evt[0].target.value;
  });
  
  //Incrementers and decrementers
  Rx.Observable.fromEvent($('#gravityX-dec'), 'click')
  .subscribe(
    function (evt) {
      var elem = $('#gravityX');
      var val = Math.round((parseFloat(elem.val())-0.1) * 100) / 100;
      elem.val(val);
      elem.change();
    },
    function (err) {
      console.log('error: ' + err);
    },
      function () {
        console.log("GravityX decrement subscribe stream completed.");
      }
  );
  
  Rx.Observable.fromEvent($('#gravityX-inc'), 'click')
  .subscribe(
    function (evt) {
      var elem = $('#gravityX');
      var val = Math.round((parseFloat(elem.val())+0.1) * 100) / 100;
      elem.val(val);
      elem.change();
    },
    function (err) {
      console.log('error: ' + err);
    },
    function () {
      console.log("GravityX increment subscribe stream completed.");
    }
  );
  
  Rx.Observable.fromEvent($('#gravityY-dec'), 'click')
  .subscribe(
    function (evt) {
      var elem = $('#gravityY');
      var val = Math.round((parseFloat(elem.val())-0.1) * 100) / 100;
      elem.val(val);
      elem.change();
    },
    function (err) {
      console.log('error: ' + err);
    },
    function () {
      console.log("GravityY decrement subscribe stream completed.");
    }
  );
  
  Rx.Observable.fromEvent($('#gravityY-inc'), 'click')
  .subscribe(
    function (evt) {
      var elem = $('#gravityY');
      var val = Math.round((parseFloat(elem.val())+0.1) * 100) / 100;
      elem.val(val);
      elem.change();
    },
    function (err) {
      console.log('error: ' + err);
    },
    function () {
      console.log("GravityY increment subscribe stream completed.");
    }
  );
  
  Rx.Observable.fromEvent($('#size-dec'), 'click')
  .subscribe(
    function (evt) {
      var elem = $('#size');
      var val = Math.round((parseFloat(elem.val())-2) * 10) / 10;
      elem.val(val);
      elem.change();
    },
    function (err) {
      console.log('error: ' + err);
    },
    function () {
      console.log("Size decrement subscribe stream completed.");
    }
  );
  
  Rx.Observable.fromEvent($('#size-inc'), 'click')
  .subscribe(
    function (evt) {
      var elem = $('#size');
      var val = Math.round((parseFloat(elem.val())+2) * 10) / 10;
      elem.val(val);
      elem.change();
    },
    function (err) {
      console.log('error: ' + err);
    },
    function () {
      console.log("Size increment subscribe stream completed.");
    }
  );
  
  Rx.Observable.fromEvent($('#restitution-dec'), 'click')
  .subscribe(
    function (evt) {
      var elem = $('#restitution');
      var val = Math.round((parseFloat(elem.val())-0.1) * 10) / 10;
      elem.val(val);
      elem.change();
    },
    function (err) {
      console.log('error: ' + err);
    },
    function () {
      console.log("Restitution decrement subscribe stream completed.");
    }
  );

  Rx.Observable.fromEvent($('#restitution-inc'), 'click')
  .subscribe(
    function (evt) {
      var elem = $('#restitution');
      var val = Math.round((parseFloat(elem.val())+0.1) * 10) / 10;
      elem.val(val);
      elem.change();
    },
    function (err) {
      console.log('error: ' + err);
    },
    function () {
      console.log("Restitution increment subscribe stream completed.");
    }
  );
  
  Rx.Observable.fromEvent($('#shrinking-dec'), 'click')
  .subscribe(
    function (evt) {
      var elem = $('#shrinking');
      var val = Math.round((parseFloat(elem.val())-0.05) * 100) / 100;
      elem.val(val);
      elem.change();
    },
    function (err) {
      console.log('error: ' + err);
    },
    function () {
      console.log("Shrinking decrement subscribe stream completed.");
    }
  );

  Rx.Observable.fromEvent($('#shrinking-inc'), 'click')
  .subscribe(
    function (evt) {
      var elem = $('#shrinking');
      var val = Math.round((parseFloat(elem.val())+0.05) * 100) / 100;
      elem.val(val);
      elem.change();
    },
    function (err) {
      console.log('error: ' + err);
    },
    function () {
      console.log("Shrinking increment subscribe stream completed.");
    }
  );
  
};