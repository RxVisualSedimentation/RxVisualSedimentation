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
    //var penetration = r - d;
    var normal = Vector.divide(n, d)
    } else {
      //var penetration = a.radius;
      var normal = new Vector(1, 0);
    }
  return new Collision(a, b, null, normal);
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

  if( x_overlap > 0 ) {
    a_extent = a.height / 2;
    b_extent = a.height / 2;

    var y_overlap = a_extent + b_extent - Math.abs( n.y );

    if( y_overlap > 0) {
      var normal;
      if(x_overlap > y_overlap){
        if(n.x < 0){
          normal = new Vector( 0, -1 );
        } else {
          normal = new Vector( 0, 1 );
        }
        return new Collision(a, b, null, normal);
      } else {
        if(n.y < 0){
          normal = new Vector( -1, 0 );
        } else {
          normal = new Vector( 1, 0 );
        }
        return new Collision(a, b, null, normal);
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

  var closest = new Vector(0,0);
  closest.x = clamp( x_extent, n.x );
  closest.y = clamp( y_extent, n.y );

  var normal = Vector.subtract(n,closest);
  var d = normal.length();
  var r = b.radius;


  if(d > r){
    return false;
  } else {
    console.log(normal);
    normal = Vector.divide(normal, d);
    console.log(normal);
    return new Collision(a, b, r + d, normal);
  }
};

var clamp = function ( extent, normal ) {
  if(normal > 0) {
    if(normal > extent ) {
      return extent;
    } else {
      return normal;
    }
  } else {
    if(Math.abs(normal) > extent) {
      return -extent;
    } else {
      return normal;
    }
  }
};
