"use strict";

/**
 * State
 * @constructor
 */
function State() {
  this.gravity = new Vector(0, 0.3);
  this.deltaRadius = -0.001;
  this.bodies = [];
  this.topics = [];
  this.emitters = [];

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

    var purgeBodies = [];

    this.bodies.map(function (body) {
      body.applyGravity(gravity);
      body.updatePosition(dt);
      if (body instanceof Circle) {
        body.updateRadius(deltaRadius);
      }
      if (body instanceof Circle && (body.radius <= 1)) {
        purgeBodies.push(body);
      }
    });

    this.bodies.concat(this.bodies.filter(function (body) {
      return (body.position.x > 2 * w ||
      body.position.x < -2 * w ||
      body.position.y > 2 * h ||
      body.position.y < -2 * h
      );
    }));

    purgeBodies.map(function(b){
      if(svg.select("#circle" + b.id)[0][0] !== null){
        svg.select("#circle" + b.id).remove();
      };
    });

    this.bodies = this.bodies.filter(function (body) {
      return purgeBodies.indexOf(body) === -1;
    })
    return this;
  }

  this.processTopic = function (givenTopic) {
    if (this.topics.indexOf(givenTopic) === -1) {
      this.topics.push(givenTopic);
      this.emitters.push(new Emitter(givenTopic, new Vector(w / 2, h / 2), new Vector(1, -1)));
      this.adjustEmitters();
    }
  }

  this.adjustEmitters = function () {
    var spacing = (w / (this.emitters.length + 1));
    svg.selectAll("text").remove();
    var randomColors = ["#556270",
      "#4ECDC4",
      "#C7F464",
      "#FF6B6B",
      "#C44D58"]
    this.emitters.forEach(function (emitter, index) {
      emitter.color = randomColors[index];
      emitter.position = new Vector(spacing * (index + 1), h / 4);
      svg.append("text")
        .attr("x", emitter.position.x-50)
        .attr("y", emitter.position.y-20)
        .attr("fill", emitter.color)
        .style("font-size", "34")
        .text(emitter.topic);
    });
  }
}

function Emitter(topic, position, velocity) {
  this.topic = topic;
  this.position = position;
  this.velocity = velocity;
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
      //console.log(tweet.created_at + " - " + tweet.topic);
      state.processTopic(tweet.topic);
      state.emitters.filter(function (emitter) {
        return emitter.topic == tweet.topic;
      }).forEach(function (emitter) {
        state.addBody(new Circle(emitter.position, 10, emitter.velocity, 0.7, 1, emitter.color));
      });
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
  state.addBody(new Rectangle(new Vector(-h / 2 + indent, h / 2), h, h - 2 * indent, new Vector(0, 0), 1, 0)); // Left wall
  state.addBody(new Rectangle(new Vector(w + h / 2 - indent, h / 2), h, h - 2 * indent, new Vector(0, 0), 1, 0)); // Right wall
  state.addBody(new Rectangle(new Vector(w / 2, h + w / 2 - indent), w + 2 * h, w, new Vector(0, 0), 1, 0)); // Floor
  state.addBody(new Rectangle(new Vector(w / 2, -w / 2 + indent), w + 2 * h, w, new Vector(0, 0), 1, 0)); // Roof
  return state;
}