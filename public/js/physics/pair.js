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

  //return per collision and filter on not null
  return pairs
    .map(function (pair) {
      if (pair.a instanceof Circle && pair.b instanceof Circle) {
        return Collision.circleVsCircle(pair);
      } else if (pair.a instanceof Rectangle && pair.b instanceof Rectangle) {
        return Collision.rectangleVsRectangle(pair);
      } else if (pair.a instanceof Circle && pair.b instanceof Rectangle) {
        var temp = pair.a;
        pair.a = pair.b;
        pair.b = temp;
        return Collision.rectangleVsCircle(pair);
      } else if (pair.a instanceof Rectangle && pair.b instanceof Circle) {
        return Collision.rectangleVsCircle(pair);
      }
    })
    .filter(function (collision) {
      return collision !== null;
    });
};