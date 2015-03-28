"use strict";

/**
 * State
 * @constructor
 */
function State() {
  this.gravity = new Vector(0, 0.1);
  this.deltaRadius = -0.05;
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
  this.update = function (dt,tweets) {
    if (tweets != null){
      if (tweets.length > 0) {
        console.log("Tweets: " + tweets.toString());
        var r = Math.random();
        this.addBody(new Circle(new Vector(w / 2, (h/2) - 200), 25, new Vector(1.5*r, 0.5), 0.7, 1));
      }
    }
    var pairs = generatePairs(this.bodies);
    var collisions = Pair.obtainCollisions(pairs);
    var gravity = this.gravity;
    var deltaRadius = this.deltaRadius;

    collisions.map(function (collision) {
      collision.resolve();
    });

    this.bodies.map(function (body) {
      body.applyGravity(gravity);
      body.updatePosition(dt);
      if (body.radius + deltaRadius > 0) {
        body.updateRadius(deltaRadius);
      }
    });
    this.bodies = this.bodies.filter(function (body) {
      return !(body.position.x > 2*w  ||
         body.position.x < -2*w ||
         body.position.y > 2*h  ||
         body.position.y < -2*h
        );
    });
    return this;
  }
}