"use strict";

/**
 * Creates the initial state of the environment.
 * @returns {State} - The starting state.
 */
function initState() {
  var state = new State();
  var amount = 50;
  var maxSpeed = 1;
  var size = 0;
  var restitution = 0.7;
  for(var i = 1; i<= amount; i++){
    var x = maxSpeed*(Math.random()-0.5);
    var y = maxSpeed*(Math.random()-0.5);
    var r = Math.random();
    state.addBody(new Circle(new Vector(i* (w/amount), r*h), i, new Vector(x, y), restitution, 1));
  }
  //state.addBody(new Circle(new Vector(w/2, h-60), size, new Vector(0, 0), restitution, 1));
  var indent = 10;
  state.addBody(new Rectangle(new Vector(-h/2 + indent, h/2), h, h-2*indent, new Vector(0, 0), 1, 0)); // Left wall
  state.addBody(new Rectangle(new Vector(w + h/2 - indent, h/2), h, h-2*indent, new Vector(0, 0), 1, 0)); // Right wall
  state.addBody(new Rectangle(new Vector(w / 2, h + w/2 - indent), w+2*h, w, new Vector(0, 0), 1, 0)); // Floor
  state.addBody(new Rectangle(new Vector(w / 2, - w/2 + indent), w+2*h, w, new Vector(0, 0), 1, 0)); // Roof
  return state;
}

/**
 * Initializes RxVisualSedimentation
 */
var init = function () {
  initButtons();
  clockInit();
  initClockSubscription();
  initEnvironment();
};
