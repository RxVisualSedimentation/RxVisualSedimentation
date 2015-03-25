"use strict";

/**
 * Creates the initial state of the environment.
 * @returns {State} - The starting state.
 */
function initState() {
  var state = new State();
  state.addBody(new Circle(new Vector(w / 2, h / 2), 30, new Vector(-2, 0), 1));
  state.addBody(new Circle(new Vector(w / 3, h / 2 + 10), 20, new Vector(2, 0), 1));
  state.addBody(new Rectangle(new Vector(2*w / 4, h / 3 + 10), 60, 30, new Vector(2, 0), 1));
  state.addBody(new Rectangle(new Vector(3*w / 4, h / 3 + 10), 60, 30, new Vector(-2, 0), 1));
  state.addBody(new Rectangle(new Vector(w / 4, h / 3), 60, 30, new Vector(0, 2), 1));
  state.addBody(new Rectangle(new Vector(w / 4, 2.5*h / 3), 60, 30, new Vector(0, -2), 1));
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
