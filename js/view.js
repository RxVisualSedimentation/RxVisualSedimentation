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
 * Redraw the current state. Actually modify the svg elements.
 * @param state - Apply the changes of the given state in the current canvas.
 */
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
        .attr("r", circle.radius)
        .attr("cx", circle.position.x)
        .attr("cy", circle.position.y);
    });
};

/**
 * Initialize all the buttons on the page.
 */
var initButtons = function () {
  createEventObservable(document.getElementById('subscribeClock'), 'click')
    .subscribe(
      function (evt) {
        $('#subscribeClock').addClass('disabled');
        $('#unsubscribeClock').removeClass('disabled');
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
        $('#subscribeClock').removeClass('disabled');
        $('#unsubscribeClock').addClass('disabled');
      },
      function (err) {
        console.log('error: ' + err);
      },
      function () {
        console.log("complete");
      }
    );
};
