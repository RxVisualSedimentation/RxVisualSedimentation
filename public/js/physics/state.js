"use strict";

/**
 * State
 * @constructor
 */
function State() {
  this.gravity = new Vector(0, 0.1);
  this.deltaRadius = 0;
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
  this.update = function (dt) {
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

/**
 * Creates the initial state of the environment.
 * @returns {State} - The starting state.
 */
State.init = function () {
  var state = new State();
  
  var tweetObserver = new TweetObservable().subscribe(
    function (message) {
      try {
        var tweet = JSON.parse(message.data);
      } catch (e) {
        console.log('This doesn\'t look like a valid JSON: ', message.data);
        return;
      }
      console.log(tweet.created_at + " - " + tweet.user.name);
      state.addBody(new Circle(new Vector(w/4, h/4), 10, new Vector(4, -2.5), 0.7, 1));
    },
    function (error) {
      console.log("Error occurred: ");
      console.log(error.toString());
    },
    function () {
      console.log('Completed');
    }
  );   
  
  var indent = 10;
  state.addBody(new Rectangle(new Vector(-h/2 + indent, h/2), h, h-2*indent, new Vector(0, 0), 1, 0)); // Left wall
  state.addBody(new Rectangle(new Vector(w + h/2 - indent, h/2), h, h-2*indent, new Vector(0, 0), 1, 0)); // Right wall
  state.addBody(new Rectangle(new Vector(w / 2, h + w/2 - indent), w+2*h, w, new Vector(0, 0), 1, 0)); // Floor
  state.addBody(new Rectangle(new Vector(w / 2, - w/2 + indent), w+2*h, w, new Vector(0, 0), 1, 0)); // Roof
  return state;
}