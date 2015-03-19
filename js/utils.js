"use strict";
var createEventObservable = function (element, eventType) {
  return Rx.Observable.create(function (observer) {

    var eventHandler = function (eventObj) {
      observer.onNext(eventObj);
    };
    //adds event listener to the element.
    element.addEventListener(eventType, eventHandler);

    //on dispose
    return function () {
      element.removeEventListener(eventType, eventHandler);
    };
  });
};

/*
 * Creates all possible pairs of bodies.
 */
var generatePairs = function (bodies) {
  var pairs = [];
  for (var i = 0; i < odies.length; i++) {
    for (var j = (i + 1); j < bodies.length; j++) {
      pairs.push(new Pair(bodies[i], bodies[j]));
    }
  }

  return pairs;
}