"use strict";
var clock;
var clockSubscription;
var clockSubscriber;

function initState() {
  return {
    circles: [
            new Circle(new Vector(w / 2, h / 2), 30, new Vector(-1, 0), 1),
            new Circle(new Vector(w / 3, h / 2), 20, new Vector(1, 0), 1)
        ],
    time: 0,
    update: function (time) {
      this.circles.map(function (circle) {
        if ((circle.y + circle.r) < h && (circle.y - circle.r > 0)) {
          circle.y += 2;
        }
      });
      this.time += 1;
      return this;
    }
  };
}

var init = function () {
  initButtons();
  initEnvironment();
  clockInit();
  initClockSubscription();
};