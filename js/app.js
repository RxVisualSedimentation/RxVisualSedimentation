"use strict";

function initState() {
  var state = new State();
  state.addBody(new Circle(new Vector(w / 2, h / 2), 30, new Vector(-2, 0), 1));
  state.addBody(new Circle(new Vector(w / 3, h / 2 + 10), 20, new Vector(2, 0), 1));
  return state;
}

var init = function () {
  initButtons();
  clockInit();
  initClockSubscription();
  initEnvironment();
};
