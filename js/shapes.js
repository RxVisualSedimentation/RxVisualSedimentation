"use strict";
/*
 * Circle
 */
function Circle(position, radius, velocity, restitution) {
  this.radius = radius;
  this.position = position;
  this.mass = radius * radius * Math.PI;
  this.velocity = velocity;
  this.restitution = restitution;
  this.intersectsWith = function (circle) {
    var r = Math.pow(this.radius + circle.radius, 2);
    return r < Math.pow(this.x + circle.x, 2) + Math.pow(this.y + circle.y, 2);
  };
  this.resolveCollisionWith = function (entity) {
    var relativeVelocity = entity.velocity.minus(this.velocity);
    var velocityAlongNormal = relativeVelocity.dotProduct(normal);
    if (velocityAlongNormal > 0) {
      return;
    }
    // Calculate the restitution.
    var e = Math.min(this.restitution, entity.restitution);
    // Calculate the impulse scalar.
    var j = -(1 + e) * velocityAlongNormal;
    j /= 1 / this.mass + 1 / entity.mass;

    // Apply Impulse
    var impulse = j * normal;
    this.velocity -= impulse.multiply(1 / this.mass);
    entity.velocity -= impulse.multiply(1 / entity.mass);
  };
}