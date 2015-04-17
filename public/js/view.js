"use strict";

var svg;
var inputObservables = {};
var w = 761,
  h = 600;
var erik;

/**
 * Initialize the environment.
 */
var initEnvironment = function () {
  erik = false;
  "use strict";
  $("#environment").css("width", w).css("height", h);
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
  
  inputObservables.reset = Rx.Observable.fromEvent($('#resetEnvironment'), 'click');
  
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
  
  inputObservables.initSpawn = Rx.Observable.fromEvent($('#environment'), 'mousedown', function (evt) {
    return { x: evt[0].offsetX,
            y: evt[0].offsetY
           };
  });
  inputObservables.completeSpawn = Rx.Observable.fromEvent($('#environment'), 'mouseup', function (evt) {
    return { x: evt[0].offsetX,
            y: evt[0].offsetY
           };
  });
  //When completeSpawn emits a value, combine it with the latest emission from initSpawn.
  inputObservables.spawn = inputObservables.completeSpawn.withLatestFrom(inputObservables.initSpawn,
    function (up, down) {
      return { 
              down: down,
              up: up
             };
    }
  );
  
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
      var val = Math.round((parseFloat(elem.val())-0.01) * 100) / 100;
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
      var val = Math.round((parseFloat(elem.val())+0.01) * 100) / 100;
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
  
  Rx.Observable.fromEvent($('#erik-meijerfy'), 'click')
  .subscribe(
    function () {
      erik = !erik;
    },
    function (err) {
      console.log('error: ' + err);
    },
    function () {
      console.log("Erik Meijerfy stream completed.");
    }
  );
  
  inputObservables.topic1 = Rx.Observable.fromEvent($('#topic1'), 'change', function (evt) {
    return evt[0].target.value;
  }).scan(
    {
      last: "",
      current: ""
    },
    function (topicTuple, topic) {
      return {
        last: topicTuple.current,
        current: topic
      };
    });
  inputObservables.topic2 = Rx.Observable.fromEvent($('#topic2'), 'change', function (evt) {
    return evt[0].target.value;
  }).scan(
    {
      last: "",
      current: ""
    },
    function (topicTuple, topic) {
      return {
        last: topicTuple.current,
        current: topic
      };
    });
  inputObservables.topic3 = Rx.Observable.fromEvent($('#topic3'), 'change', function (evt) {
    return evt[0].target.value;
  }).scan(
    {
      last: "",
      current: ""
    },
    function (topicTuple, topic) {
      return {
        last: topicTuple.current,
        current: topic
      };
    });
  inputObservables.topic4 = Rx.Observable.fromEvent($('#topic4'), 'change', function (evt) {
    return evt[0].target.value;
  }).scan(
    {
      last: "",
      current: ""
    },
    function (topicTuple, topic) {
      return {
        last: topicTuple.current,
        current: topic
      };
    });
};