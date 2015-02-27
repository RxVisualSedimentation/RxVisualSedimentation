var svg;

var w = 800, h = 600;
var balls;
var boundaries;
var collided;
var sub;
var observer;
var hot;

var ball_source;

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

var init = function(){
  console.log("Initializing");

  balls = [
    new Ball(w/2,h/8,20,1.03)
  ];
  boundaries = [
    new Ground(0,h-20,20,w)
  ];

  var collided = false;

  svg = d3.select("#planetarium").insert("svg") .attr("width", w).attr("height", h);
  
  for(var i in boundaries) {
    var boundary = boundaries[i];
    svg.append("rect").attr("x", boundary.x).attr("y", boundary.y).attr("height", boundary.h).attr("width", boundary.w).attr("class", "boundary")
    console.log("Boundary added.");
  }
  for(var i in balls) {
    var ball = balls[i];
    svg.append("circle").attr("r", ball.r).attr("cx", ball.x).attr("cy", ball.y).attr("class", "ball")
    console.log("Ball added.");
  }
}

var collision = function(){
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


var startReactive = function(){
  console.log("Starting")
  var source = Rx.Observable.timer(
    0, /* 0 seconds */
    10 /* 10 ms */
  )
  hot = source.publish();
  observer = Rx.Observer.create(
    function (x) {
      if(!collision()){
        svg.selectAll(".ball").data(balls).attr("cy", function(d) { return d.y=d.y*d.acc; });
      }
    },
    function (e) {
      console.log('onError: %s', e);
    },
    function () {
      console.log('onCompleted');
    }
  );
  disposable = hot.connect();
  sub = hot.subscribe(observer);
}

var stopReactive = function(){
  console.log("Stopping")
  d3.select("#planetarium").select("svg").remove();
  sub.dispose();
}

