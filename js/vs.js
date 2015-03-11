var clock,
  ballstream;
var clockSub;
var idcounter;

var svg;
var w = 800,
  h = 600;
var balls;
var boundaries;
var collided;

/*
 * Ball
 */
function Ball(x, y, r, a, t) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.acc = a;
  this.age = t;
  this.id = idcounter++;
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
  svg = d3.select("#environment").insert("svg").attr("width", w).attr("height", h);

  for (var i in boundaries) {
    var boundary = boundaries[i];
    svg.append("rect").attr("x", boundary.x)
      .attr("y", boundary.y)
      .attr("height", boundary.h)
      .attr("width", boundary.w)
      .attr("class", "boundary");
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
  idcounter = 0;
  initButtons();
  initEnvironment();
  // initBallStream();
  clockInit();
  clock
    .scan(initState(), function(state,time) { return state.update(time) })
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
}

function redraw(state) {
  state.circles
  .filter(function(circle){ return circle.age === 0})
  .map(function (circle) {
      svg.append("circle").attr("r", circle.r)
      .attr("cx", circle.x)
      .attr("cy", circle.y)
      .attr("id", "circle"+circle.id)
      .attr("class", "ball");
    } 
  );    
  state.circles
  .filter(function(circle){ return circle.age > 0})
  .map(function (circle) {
    svg
    .select("#circle"+circle.id)
      .attr("cy", circle.y);
  });
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
      new Ball(w / 2, h / 8, 30, 1.03, -1),
      new Ball(w / 3, h / 8, 20, 1.03, -1)
    ],
    time : 0,
    update : function(time) {
      this.circles.map(function (circle) {
        circle.age += 1;
        circle.y += 2;
      });
      this.time += 1;
      return this;
    }
  }
  return state;
}

function clockInit() {
  clock = Rx.Observable.timer(
    0, /* 0 seconds */
    20 /* 200 ms */
  )
}

$(document).ready(init);