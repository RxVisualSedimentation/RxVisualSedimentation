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

  /**
   * Adjust the resulting properties caused by the collision for the given entity.
   * @param entity
   * @param normal - The vector of the general impulse for the entity.
   */
  this.resolveCollisionWith = function (entity, normal) {
    var relativeVelocity = Vector.subtract(entity.velocity, this.velocity);
    var velocityAlongNormal = Vector.dotProduct(relativeVelocity, normal);
    if (velocityAlongNormal > 0) {
      return;
    }
    // Calculate the restitution.
    var e = Math.min(this.restitution, entity.restitution);
    // Calculate the impulse scalar.
    var j = -(1 + e) * velocityAlongNormal;
    j /= 1 / this.mass + 1 / entity.mass;

    // Apply Impulse
    var impulse = Vector.multiply(normal, j);
    this.velocity = Vector.subtract(this.velocity, Vector.multiply(impulse, (1 / entity.mass)));
    entity.velocity = Vector.add(entity.velocity, Vector.multiply(impulse, (1 / entity.mass)));
  };

  /**
   * Update the position of the circle.
   * @param dt - the change in time.
   */
  this.updatePosition = function (dt) {
    var distanceVector = Vector.multiply(this.velocity, dt);
    this.position = Vector.add(this.position, distanceVector);
  }
}