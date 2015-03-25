"use strict";

/**
 * Circle
 * @param position - vector of the position.
 * @param radius - the radius of the circle.
 * @param velocity - the speed that the circle is travelling at.
 * @param restitution - the bounciness of the circle.
 * @constructor
 */
function Circle(position, radius, velocity, restitution) {
  this.drawn = false;
  this.id = nextBodyId();
  this.radius = radius;
  this.position = position;
  this.mass = 1; //radius * radius * Math.PI;
  this.velocity = velocity;
  this.restitution = restitution;
}

/**
   * Update the velocity of the circle by applying gravity.
   * @param gravity - the gravity vector.
   */
Circle.prototype.applyGravity = function (gravity) {
  this.velocity = Vector.add(this.velocity, gravity);
};

/**
   * Update the position of the circle.
   * @param dt - the change in time.
   */
Circle.prototype.updatePosition = function (dt) {
  var distanceVector = Vector.multiply(this.velocity, dt);
  this.position = Vector.add(this.position, distanceVector);
};

/**
   * Update the radius of the circle.
   * @param delta_radius - the change in radius.
   */
Circle.prototype.updateRadius = function (delta_radius) {
  this.radius += delta_radius;
};