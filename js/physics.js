"use strict";
/*
 * Collision
 */
function Collision(a, b, penetration, normal) {
  this.a = a;
  this.b = b;
  this.penetration = penetration;
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
      this.penetration = r - d;
      this.normal = n.divide(d);
    } else {
      this.penetration = a.radius;
      this.normal = new Vector(1, 0);
    }
    return true;
  };
}

/*
 * Vector
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

/*
 * Pair
 */
function Pair(a, b) {
  this.a = a;
  this.b = b;
}

/*
 * State
 */
function State() {
  this.gravity = new Vector(0, 5);
  this.bodies = [];
  this.addBody = function (body) {
    this.bodies.push(body);
  }
  this.update = function (dt) {
    var pairs = generatePairs(this.bodies);
    var collisions = [];
    for (var i in pairs) {
      var collision = new Collision(pairs[i].a, pairs[i].b, null, null);
      var collided = collision.circleVsCircle();
      if (collided) {
        collisions.push(collision);
      }
    }
    for (var i in collisions) {
      collisions[i].a.resolveCollisionWith(collisions[i].b, collisions[i].normal);
    }
    for (var i in this.bodies) {
      this.bodies[i].updatePosition(dt);
    }
    return this;
  }

}