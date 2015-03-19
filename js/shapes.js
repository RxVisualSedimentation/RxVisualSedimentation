"use strict";

/*
 * Circle
 */
function Circle(position, radius, velocity, restitution) {
  this.drawn = false;
  this.id = nextBodyId();
  this.radius = radius;
  this.position = position;
  this.mass = 1;//radius * radius * Math.PI;
  this.velocity = velocity;
  this.restitution = restitution;

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

  this.updatePosition = function(dt){
    var distanceVector = this.velocity.multiply(dt);
    this.position = this.position.add(distanceVector);
  }
}