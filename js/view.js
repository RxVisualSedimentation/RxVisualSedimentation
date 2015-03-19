"use strict";
var svg;
var w = 800,
  h = 600;


var boundaries;

var initEnvironment = function () {
  "use strict";
  svg = d3.select("#environment").insert("svg").attr("width", w).attr("height", h);
};

var redraw = function (state) {
  state.bodies
    .filter(function (circle) {
      return circle.drawn === false;
    })
    .map(function (circle) {
      svg.append("circle").attr("r", circle.radius)
        .attr("cx", circle.position.x)
        .attr("cy", circle.position.y)
        .attr("id", "circle" + circle.id)
        .attr("class", "ball");
      circle.drawn = true;
    });
  
  state.bodies
    .map(function (circle) {
      svg
        .select("#circle" + circle.id)
        .attr("cx", circle.position.x)
        .attr("cy", circle.position.y);
    });
};


var initButtons = function () {
  createEventObservable(document.getElementById('subscribeClock'), 'click')
    .subscribe(
      function (evt) {
        subscribeToClock();
      },
      function (err) {
        console.log('error: ' + err);
      },
      function () {
        console.log("complete");
      }
    );
  createEventObservable(document.getElementById("unsubscribeClock"), 'click')
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
};