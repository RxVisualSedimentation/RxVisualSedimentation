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
  * Resolve the collision by adjusting the entities' properties.
  */
Collision.prototype.resolve = function () {
  var relativeVelocity = Vector.subtract(this.b.velocity, this.a.velocity);
  var velocityAlongNormal = Vector.dotProduct(relativeVelocity, this.normal);
  if (velocityAlongNormal > 0) {
    return;
  }
  // Calculate the restitution.
  var e = Math.min(this.a.restitution, this.b.restitution);
  // Calculate the impulse scalar.
  var j = -(1 + e) * velocityAlongNormal;
  j /= 1 / this.a.mass + 1 / this.b.mass;

  // Apply Impulse
  var impulse = Vector.multiply(this.normal, j);
  this.a.velocity = Vector.subtract(this.a.velocity, Vector.multiply(impulse, (1 / this.b.mass)));
  this.b.velocity = Vector.add(this.b.velocity, Vector.multiply(impulse, (1 / this.b.mass)));
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
