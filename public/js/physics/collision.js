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
  this.penetration = penetration;
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
  j /= (this.a.inv_mass + this.b.inv_mass);

  // Apply Impulse
  var impulse = Vector.multiply(this.normal, j);
  this.a.velocity = Vector.subtract(this.a.velocity, Vector.multiply(impulse, this.a.inv_mass));
  this.b.velocity = Vector.add(this.b.velocity, Vector.multiply(impulse, this.b.inv_mass));
  
  this.correctPosition();
}

Collision.prototype.correctPosition = function () {
  var percent = 0.1; //correction percentage
  var correction = Vector.multiply(this.normal, (this.penetration / (this.a.inv_mass + this.b.inv_mass)) * percent);
  this.a.position = Vector.subtract(this.a.position, Vector.multiply(correction, this.a.inv_mass));
  this.b.position = Vector.add(this.b.position, Vector.multiply(correction, this.b.inv_mass));
}

/**
 * Verifies whether a pair of circles collide and returns a Collision.
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
    var penetration = r - d;
    var normal = Vector.divide(n, d)
  } else {
    var penetration = a.radius;
    var normal = new Vector(1, 0);
  }
  return new Collision(a, b, penetration, normal);
};

/**
 * Verifies whether a pair of rectangles collide and returns a Collision.
 * @param pair - a Pair of bodies
 * @returns A collision or null.
 */
Collision.rectangleVsRectangle = function (pair) {
  var a = pair.a;
  var b = pair.b;
  var n = Vector.subtract(b.position, a.position);

  var a_extent = a.width / 2;
  var b_extent = b.width / 2;

  var x_overlap = a_extent + b_extent - Math.abs(n.x);

  if (x_overlap > 0) {
    a_extent = a.height / 2;
    b_extent = b.height / 2;

    var y_overlap = a_extent + b_extent - Math.abs(n.y);

    if (y_overlap > 0) {
      var normal;
      if (x_overlap > y_overlap) {
        if (n.x < 0) {
          normal = new Vector(0, -1);
        } else {
          normal = new Vector(0, 1);
        }
        return new Collision(a, b, x_overlap, normal);
      } else {
        if (n.y < 0) {
          normal = new Vector(-1, 0);
        } else {
          normal = new Vector(1, 0);
        }
        return new Collision(a, b, y_overlap, normal);
      }
    }
  }
  return null;
};

/**
 * Verifies whether a pair of a circle and a rectangle collide and returns a Collision.
 * @param pair - a Pair of bodies
 * @returns A collision or null.
 */
Collision.rectangleVsCircle = function (pair) {
  var a = pair.a;
  var b = pair.b;


  var x_extent = a.width / 2;
  var y_extent = a.height / 2;

  var n = Vector.subtract(b.position, a.position);
  var closest = new Vector(0, 0);
  closest.x = clamp(x_extent, n.x);
  closest.y = clamp(y_extent, n.y);

  var inside = false;

  if (n.equals(closest)) {
    inside = true;
    if (Math.abs(n.x) > Math.abs(n.y)) {
      if (closest.x > 0)
        closest.x = x_extent;
      else
        closest.x = -x_extent;
    }
    // y axis is shorter
    else {
      if (closest.y > 0)
        closest.y = y_extent;
      else
        closest.y = -y_extent;
    }
  }
  var normal = Vector.subtract(n, closest);
  var d = normal.length();
  var r = b.radius;


  if (d > r && !inside) {
    return null;
  }
  
  if (inside) {
    if (d !== 0) {
      normal = Vector.multiply(Vector.divide(normal, d), -1);
    } else {
      normal = new Vector(1, 0);
    }
    return new Collision(a, b, r - d, normal);
  } else {
    if (d !== 0) {
      normal = Vector.divide(normal, d);
    } else {
      normal = new Vector(1, 0);
    }
    return new Collision(a, b, r - d, normal);
  }
};

var clamp = function (extent, normal) {
  if (normal > 0) {
    if (normal > extent) {
      return extent;
    } else {
      return normal;
    }
  } else {
    if (Math.abs(normal) > extent) {
      return -extent;
    } else {
      return normal;
    }
  }
};