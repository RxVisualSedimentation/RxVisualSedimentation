var svg;

var sub;
var observer;
var hot;
var w = 800, h = 600;
var t0 = Date.now();
var balls;
var grounds;
var collided;

var init = function(){
  console.log("Initializing");

  balls = [
    { x: w/2, y: h/8, r: 20, acc: 1.03}
  ];
  grounds = [
    { x: 0, y: h-20, "width": w, "height": 20}
  ];

  var collided = false;

  svg = d3.select("#planetarium").insert("svg") .attr("width", w).attr("height", h);
  svg.append("circle").attr("r", 20).attr("cx", w/2).attr("cy", h/8).attr("class", "ball")
  svg.append("rect").attr("x", 0).attr("y", h-20).attr("height", 20).attr("width", w).attr("class", "ground")
}

var collision = function(){
  for(var i in balls) {
    var ball = balls[i];
    for(var j in grounds) {
      var ground = grounds[j];
      if((ball.y*ball.acc)>h-40){
        console.log(h-ball.y)
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
      var delta = (Date.now() - t0);
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

