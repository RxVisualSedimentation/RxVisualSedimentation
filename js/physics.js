"use strict";

/**
 * Collision
 * @param a - One of the two objects colliding.
 * @param b - The other of the two objects colliding.
 * @param penetration  - The amount of overlap caused by the collision.
 * @param normal - The normal vector.
 * @constructor
 */
function Collision(a, b, penetration, normal) {
  this.a = a;
  this.b = b;
  //this.penetration = penetration;
  this.normal = normal;
  this.circleVsCircle = function () {
    var r = a.radius + b.radius;
    var n = b.position.minus(a.position);
    var nSquared = Math.pow(n.x, 2) + Math.pow(n.y, 2);
    if (nSquared > Math.pow(r, 2)) {
      return false;
    }
    var d = n.length();
    if (d !== 0) {
      //this.penetration = r - d;
      this.normal = n.divide(d);
    } else {
      //this.penetration = a.radius;
      this.normal = new Vector(1, 0);
    }
    return true;
  };
}

/**
 * Vector
 * @param x - The x-coordinate
 * @param y - The y-coordinate
 * @constructor
 */
function Vector(x, y) {
  this.x = x;
  this.y = y;
  this.length = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };
  this.add = function (v2) {
    return new Vector(this.x + v2.x, this.y + v2.y);
  };
  this.minus = function (v2) {
    return new Vector(this.x - v2.x, this.y - v2.y);
  };
  this.multiply = function (i) {
    return new Vector(this.x * i, this.y * i);
  };
  this.divide = function (i) {
    return new Vector(this.x / i, this.y / i);
  };
  this.dotProduct = function (v2) {
    return this.x * v2.x + this.y * v2.y;
  }
}

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
 * State
 * @constructor
 */
function State() {
  this.gravity = new Vector(0, 0.1);
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
    var collisions = obtainCollisions(pairs);
    var gravity = this.gravity;

    collisions.map(function(collision){
      collision.a.resolveCollisionWith(collision.b, collision.normal);
    });

    this.bodies.map(function(body){
      body.updatePosition(dt,gravity);
    });
    return this;
  }
}

/**
 * Obtains all the possible collisions.
 * @param pairs - All the possible pairs of objects.
 * @returns {Array} - The possible collisions.
 */
var obtainCollisions = function(pairs){
  var collisions = [];
  pairs.map(function(pair){
    var collision = new Collision(pair.a, pair.b, null, null);
    var collided = collision.circleVsCircle();
    if (collided) {
      collisions.push(collision);
    }
  });
  return collisions;
};
