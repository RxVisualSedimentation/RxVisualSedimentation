var clock,
    ballstream;
var clockSub;

var svg;
var w = 800, h = 600;
var balls;
var boundaries;
var collided;

/*
 * Ball
 */
function Ball(x,y,r,a){
  this.x = x;
  this.y = y;
  this.r = r;
  this.acc = a;
}

/*
 * Ground
 */
function Ground(x,y,h,w){
  this.x = x;
  this.y = y;
  this.h = h;
  this.w = w;
}

var collisionDetection = function(){
  for(var i in balls) {
    var ball = balls[i];
    for(var j in boundaries) {
      var boundary = boundaries[j];
      if((ball.y*ball.acc)>boundary.y-ball.r){
        return true;
      }
    }
  }
  return false;
}

var initEnvironment = function(){
  balls = [
    new Ball(w/2,h/8,30,1.03),
    new Ball(w/3,h/8,20,1.03)
  ];
  boundaries = [
    new Ground(0,h-20,20,w)
  ];

  var collided = false;

  svg = d3.select("#environment").insert("svg") .attr("width", w).attr("height", h);
  
  for(var i in boundaries) {
    var boundary = boundaries[i];
    svg.append("rect").attr("x", boundary.x)
                      .attr("y", boundary.y)
                      .attr("height", boundary.h)
                      .attr("width", boundary.w)
                      .attr("class", "boundary")
  }
  for(var i in balls) {
    var ball = balls[i];
    svg.append("circle").attr("r", ball.r)
                        .attr("cx", ball.x)
                        .attr("cy", ball.y)
                        .attr("class", "ball")
  }
}

function initBallStream() {
  ballstream = Rx.Observable.from(svg.selectAll(".ball")[0]).subscribe(
    function (x) {
      var cy = parseInt(x.getAttribute("cy"));
      
      x.setAttribute("cy", cy+1);
      //x.setAttribute("cy", function(d) { return d.y=d.y*d.acc; });
    },
    function (err) {
      console.log('Error: ' + err);
    },
    function () {
      console.log('Completed');
    }
  );
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
  initEnvironment();
  initBallStream();
  clockInit();
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

function multiObserverables() {
  // Creates an observable sequence of 5 integers, starting from 1
  var a = Rx.Observable.range(1, 10);
  var b = Rx.Observable.range(5, 10)

  var observer = Rx.Observer.create(
    function (x) {
      console.log('onNext: %s', x);
    },
    function (e) {
      console.log('onError: %s', e);
    },
    function () {
      console.log('onCompleted');
    }
  );

  var x = Rx.Observable.zip(a, b, function (a1, b1) {
      return a1 * b1;
    })
    .subscribe(observer);
}

function clockInit() {
  source = Rx.Observable.timer(
    0, /* 0 seconds */
    10 /* 250 ms */
  )
  clock = source.publish();
  clock.connect();
}

function unsubscribeFromClock() {
  clockSub.dispose();
}

function subscribeToClock() {
  clockSub = clock.subscribe(
    function (x) {
      if(!collisionDetection()){
        initBallStream();
      }
    },
    function (e) {
      console.log('onError: %s', e);
    },
    function () {
      console.log('onCompleted');
    }
  );
}

$(document).ready(init);

