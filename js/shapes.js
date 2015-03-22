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
    var impulse = normal.multiply(j);
    this.velocity = this.velocity.minus(impulse.multiply(1 / this.mass));
    entity.velocity = entity.velocity.add(impulse.multiply(1 / entity.mass));
  };

  /**
   * Update the velocity of the circle by applying gravity.
   * @param gravity - the gravity vector.
   */
  this.applyGravity = function(gravity){
    this.velocity = this.velocity.add(gravity);
  };

  /**
   * Update the position of the circle.
   * @param dt - the change in time.
   * @param gravity - the gravity vector.
   */
  this.updatePosition = function(dt){

    var distanceVector = this.velocity.multiply(dt);
    this.position = this.position.add(distanceVector);
  };

  /**
   * Update the radius of the circle.
   * @param delta_radius - the change in radius.
   */
  this.updateRadius = function(delta_radius){
    this.radius += delta_radius;
  };
}