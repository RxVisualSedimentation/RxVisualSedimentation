"use strict";

/**
 * Rectangle
 * @param position - vector of the bottom left corner position.
 * @param width - the width of the rectangle.
 * @param height - the height of the rectangle.
 * @param velocity - the speed that the circle is travelling at.
 * @param restitution - the bounciness of the circle.
 * @constructor
 */
function Rectangle(position, width, height, velocity, restitution) {
  this.drawn = false;
  this.id = nextBodyId();
  this.position = position;
  this.width = width;
  this.height = height;
  this.mass = 1;
  this.velocity = velocity;
  this.restitution = restitution;
}

/**
   * Update the velocity of the rectangle by applying gravity.
   * @param gravity - the gravity vector.
   */
Rectangle.prototype.applyGravity = function (gravity) {
  this.velocity = Vector.add(this.velocity, gravity);
};

/**
   * Update the position of the rectangle.
   * @param dt - the change in time.
   */
Rectangle.prototype.updatePosition = function (dt) {
  var distanceVector = Vector.multiply(this.velocity, dt);
  this.position = Vector.add(this.position, distanceVector);
};
