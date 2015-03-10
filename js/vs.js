var clock,
  ballstream;
var clockSub;

var svg;
var w = 800,
  h = 600;
var balls;
var boundaries;
var collided;

/*
 * Ball
 */
function Ball(x, y, r, a) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.acc = a;
}

/*
 * Ground
 */
function Ground(x, y, h, w) {
  this.x = x;
  this.y = y;
  this.h = h;
  this.w = w;
}


var initEnvironment = function () {

  boundaries = [
    new Ground(0, h - 20, 20, w)
  ];

  var collided = false;

  svg = d3.select("#environment").insert("svg").attr("width", w).attr("height", h);

  for (var i in boundaries) {
    var boundary = boundaries[i];
    svg.append("rect").attr("x", boundary.x)
      .attr("y", boundary.y)
      .attr("height", boundary.h)
      .attr("width", boundary.w)
      .attr("class", "boundary")
  }
  for (var i in balls) {
    var ball = balls[i];
    svg.append("circle").attr("r", ball.r)
      .attr("cx", ball.x)
      .attr("cy", ball.y)
      .attr("class", "ball")
  }
}

function createObservable(element, eventType) {

  return Rx.Observable.create(function (observer) {

    var eventHandler = function (eventObj) {
        observer.onNext(eventObj);
      }
      //adds event listener to the element.
    element.addEventListener(eventType, eventHandler);

    //on dispose
    return function () {
      element.removeEventListener(eventType, eventHandler);
    };
  });
};

function init() {
  initButtons();
  // initEnvironment();
  // initBallStream();
  clockInit();
  clock
    .scan(initState(), function(state,time) { return state.update(time) })
    .subscribe(
      function (x) {
        console.log("Current Time: " + x.time);
      },
      function (e) {
        console.log('onError: %s', e);
      },
      function () {
        console.log('onCompleted');
      }
    );
}

function initButtons() {
  //button
  createObservable(document.getElementById('subClock'), 'click')
    .subscribe(
      function (evt) {
        subscribeToClock()
      },
      function (err) {
        console.log('error: ' + err);
      },
      function () {
        console.log("complete");
      }
  );

  createObservable(document.getElementById('unsubClock'), 'click')
    .subscribe(
      function (evt) {
        unsubscribeFromClock();
      },
      function (err) {
        console.log('error: ' + err);
      },
      function () {
        console.log("complete");
      }
  );
}

function initState() {
  var state = {
    circles: [
      new Ball(w / 2, h / 8, 30, 1.03),
      new Ball(w / 3, h / 8, 20, 1.03)
    ],
    time : 0,
    update : function(time) {
      this.time += 1;
      return this;
    }
  }
  return state;
}

function clockInit() {
  clock = Rx.Observable.timer(
    0, /* 0 seconds */
    1000 /* 1000 ms */
  )
}

$(document).ready(init);