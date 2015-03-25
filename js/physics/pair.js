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

    var collision;
    if (pair.a instanceof Circle && pair.b instanceof Circle) {
      collision = Collision.circleVsCircle(pair);
    } else if (pair.a instanceof Rectangle && pair.b instanceof Rectangle) {
      collision = Collision.rectangleVsRectangle(pair);
    }
    if (collision) {
      collisions.push(collision);
    }
  });
  return collisions;
};