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

/**
 * State
 * @constructor
 */
function State() {
  this.gravity = new Vector(0, 0.1);
  this.deltaRadius = -0.1;
  this.bodies = [];
  /**
   * Add bodies to the environment.
   * @param body - the to be added body.
   */
  this.addBody = function (body) {
    this.bodies.push(body);
  };
  /**
   * Update the state for the given delta time.
   * @param dt - delta time.
   * @returns {State} - The updated state.
   */
  this.update = function (dt) {
    var pairs = generatePairs(this.bodies);
    var collisions = Pair.obtainCollisions(pairs);
    var gravity = this.gravity;
    var deltaRadius = this.deltaRadius;

    collisions.map(function (collision) {
      collision.a.resolveCollisionWith(collision.b, collision.normal);
    });

    this.bodies.map(function (body) {
      body.applyGravity(gravity);
      body.updatePosition(dt);
      if (body.radius + deltaRadius > 0) {
        body.updateRadius(deltaRadius);
      }
    });
    return this;
  }
}