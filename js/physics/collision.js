"use strict";

/**
 * Collision
 * @param a - One of the two bodies colliding.
 * @param b - The other of the two bodies colliding.
 * @param penetration  - The amount of overlap caused by the collision.
 * @param normal - The normal vector.
 * @constructor
 */
function Collision(a, b, penetration, normal) {
  this.a = a;
  this.b = b;
  //this.penetration = penetration;
  this.normal = normal;
}

/**
 * Verifies whether a pair of bodies collide and returns an Collision.
 * @param a - Pair of bodies
 * @returns - A collision or null.
 */
Collision.circleVsCircle = function (pair) {
  var a = pair.a;
  var b = pair.b;
  var r = a.radius + b.radius;
  var n = Vector.subtract(b.position, a.position);
  var nSquared = Math.pow(n.x, 2) + Math.pow(n.y, 2);
  if (nSquared > Math.pow(r, 2)) {
    return null;
  }
  var d = n.length();
  if (d !== 0) {
    //var penetration = r - d;
    var normal = Vector.divide(n, d)
    } else {
      //var penetration = a.radius;
      var normal = new Vector(1, 0);
    }
  return new Collision(a, b, null, normal);
};