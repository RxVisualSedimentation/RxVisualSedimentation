"use strict";

/**
 * Pair (of objects)
 * @param a - One object
 * @param b - Another object
 * @constructor
 */
function Pair(a, b) {
  this.a = a;
  this.b = b;
}

/**
 * Obtains all the possible collisions.
 * @param pairs - All the possible pairs of objects.
 * @returns {Array} - The possible collisions.
 */
Pair.obtainCollisions = function (pairs) {
  var collisions = [];
  pairs.map(function (pair) {
    var collision = Collision.circleVsCircle(pair);
    if (collision) {
      collisions.push(collision);
    }
  });
  return collisions;
};
