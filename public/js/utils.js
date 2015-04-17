"use strict";

var bodyId;

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
