"use strict";

var bodyId;

/**
 * Create an observable for the given element which has the given events.
 * @param element - Create the observable for this element.
 * @param eventType - The element should emit these type of events.
 * @returns {Rx.Observable<T>} - The resulting observable.
 */
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

/**
 * Creates all possible pairs of bodies.
 * @param bodies - All the bodies in the environment.
 * @returns {Array} - All Possible Pairs without duplicates.
 */
var generatePairs = function (bodies) {
  var pairs = [];
  for (var i = 0; i < bodies.length; i++) {
    for (var j = (i + 1); j < bodies.length; j++) {
      pairs.push(new Pair(bodies[i], bodies[j]));
    }
  }
  return pairs;
};

/**
 * Generate a new, unique number for every body.
 * @returns {number}
 */
var nextBodyId = function () {
  if (bodyId == null) {
    bodyId = 0;
  }
  return bodyId++;
};
