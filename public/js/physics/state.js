"use strict";

/**
 * State
 * @constructor
 */
function State() {
  this.gravity = new Vector(0, 0.3);
  this.deltaRadius = 0;
  this.bodies = [];
  this.topics = [];
  this.emitters = [];
  this.randomColors = ["#556270",
                       "#4ECDC4",
                       "#C7F464",
                       "#FF6B6B",
                       "#C44D58"];
  
  /**
   * Add bodies to the environment.
   * @param body - the to be added body.
   */
  this.addBody = function (body) {
    this.bodies.push(body);
  };
  
  /**
   * Updates the restitution of the bodies
   * @param restitution - the restitution to set
   */
  this.updateRestitution = function (restitution) {
    this.bodies.map(function(body) { 
      body.restitution = restitution;
    })
  };
  
  this.resetEnvironment = function () { 
    this.bodies.filter(function(body) { 
      return body instanceof Circle;
    })
    .map(function(body) { 
      body.destroySVG();
    });
    this.bodies = this.bodies.filter(function(body) { 
      return !(body instanceof Circle);
    })
  }
  
  /**
   * Update the state for the given delta time.
   * @param dt - delta time.
   * @returns {State} - The updated state.
   */
  this.update = function (dt) {
    var gravity = this.gravity;
    var deltaRadius = this.deltaRadius;
    var pairs = generatePairs(this.bodies);
    Pair.obtainCollisions(pairs)
      .map(function (collision) {
        collision.resolve();
      });

    var purgeBodies = [];

    this.bodies.map(function (body) {
      body.applyGravity(gravity);
      body.updatePosition(dt);
      if (body instanceof Circle) {
        body.updateRadius(deltaRadius);
      }
    });

    var purgeBodies = this.bodies.filter(function (body) {
      var outsideEnvironment = body instanceof Circle &&
        (body.position.x > 2 * w ||
        body.position.x < -2 * w ||
        body.position.y > 2 * h ||
        body.position.y < -2 * h
        );
      var shrunk = body instanceof Circle && (body.radius <= 1);
      return shrunk || outsideEnvironment;
    });
    
    purgeBodies.map(function(body){
      body.destroySVG();
      return body;
    });

    this.bodies = this.bodies.filter(function (body) {
      return purgeBodies.indexOf(body) === -1;
  });
    return this;
  }

  this.processTopic = function (givenTopic, lastTopic) {
    this.topics = this.topics.filter(function(topic) {
      return topic !== lastTopic;
    });
    //Re-add color if necessary, cannot use forEach as we need access to this.randomColors
    for(var i=0; i<this.emitters.length; i++){
      if(this.emitters[i].topic == lastTopic) {
        console.log(this.emitters[i]);
        if (this.randomColors.indexOf(this.emitters[i].color) === -1) {
          this.randomColors.push(this.emitters[i].color);
        }
      }
    }
    //update emitters array
    this.emitters = this.emitters.filter(function(emitter) {
      return emitter.topic !== lastTopic;
    });
    if (this.topics.indexOf(givenTopic) === -1) {
      this.topics.push(givenTopic);
      this.emitters.push(new Emitter(givenTopic, new Vector(w / 2, h / 2), new Vector(1, -1), this.randomColors.shift()));
      this.adjustEmitters();
    }
  }

  this.adjustEmitters = function () {
    var spacing = (w / (this.emitters.length + 1));
    svg.selectAll("text").remove();
    this.emitters.forEach(function (emitter, index) {
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

function Emitter(topic, position, velocity, color) {
  this.topic = topic;
  this.position = position;
  this.velocity = velocity;
  this.color = color;
}

/**
 * Creates the initial state of the environment.
 * @returns {State} - The starting state.
 */
State.init = function () {
  var state = new State();
  var restitution = 0.7;
  var size = 10;
  
  inputObservables.reset
  .subscribe(
    function (x) {
      state.resetEnvironment();
    },
    function (err) {
      console.log('error: ' + err);
    },
    function () {
      console.log("Reset environment stream completed.");
    }
  );  
  
  inputObservables.gravityX
  .map(function (input) {
    return parseFloat(input);
  })
  .filter(function (input) {
    return !isNaN(input);
  })
  .subscribe(
    function (x) {
      state.gravity.x = x;
      console.log("x: " + x);  
    },
    function (err) {
      console.log('error: ' + err);
    },
    function () {
      console.log("Gravity x update stream completed.");
    }
  );
  
  inputObservables.gravityY
  .map(function (input) {
    return parseFloat(input);
  })
  .filter(function (input) {
    return !isNaN(input);
  })
  .subscribe(
    function (y) {
      state.gravity.y = y;
      console.log("y: " + y);  
    },
    function (err) {
      console.log('error: ' + err);
    },
    function () {
      console.log("Gravity y update stream completed.");
    }
  );

  inputObservables.size
  .map(function (input) {
    return parseFloat(input);
  })
  .filter(function (input) {
    return !isNaN(input);
  })
  .subscribe(
    function (x) {
      size = x;
      console.log("Size updated: " + x);  
    },
    function (err) {
      console.log('error: ' + err);
    },
    function () {
      console.log("Restitution update stream completed.");
    }
  );
  
  inputObservables.restitution
  .map(function (input) {
    return parseFloat(input);
  })
  .filter(function (input) {
    return !isNaN(input);
  })
  .subscribe(
    function (x) {
      restitution = x;
      state.updateRestitution(x);
      console.log("restitution updated: " + x);  
    },
    function (err) {
      console.log('error: ' + err);
    },
    function () {
      console.log("Restitution update stream completed.");
    }
  );
  
  inputObservables.shrinking
  .map(function (input) {
    return parseFloat(input);
  })
  .filter(function (input) {
    return !isNaN(input);
  })
  .subscribe(
    function (value) {
      state.deltaRadius = value;
      console.log("Shrinking updated: " + value);  
    },
    function (err) {
      console.log('error: ' + err);
    },
    function () {
      console.log("Shrinking update stream completed.");
    }
  );
  
  inputObservables.spawn
  .subscribe(
    function (coordinates) {
      var dx = coordinates.down.x - coordinates.up.x;
      var dy = coordinates.down.y - coordinates.up.y;      
      var vx = dx/10;
      var vy = dy/10;
      state.addBody(new Circle(new Vector(coordinates.down.x, coordinates.down.y), size, new Vector(vx, vy), restitution, 1, "#00a6d6")); 
    },
    function (err) {
      console.log('error: ' + err);
    },
    function () {
      console.log("Circle spawn stream completed.");
    }
  );  
  
  var tweetObserver = new TweetObservable().subscribe(
    function (message) {
      try {
        var tweet = JSON.parse(message.data);
      } catch (e) {
        console.log('This doesn\'t look like a valid JSON: ', message.data);
        return;
      }
      state.processTopic(tweet.topic, tweet.lastTopic);
      state.emitters.filter(function (emitter) {
        return emitter.topic == tweet.topic;
      }).forEach(function (emitter) {
        state.addBody(new Circle(emitter.position, size, emitter.velocity, restitution, size, emitter.color));
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