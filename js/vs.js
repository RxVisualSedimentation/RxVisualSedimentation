var clock;
var clockSubscription;
var clockSubscriber;
var idCounter;

var svg;
var w = 800,
    h = 600;
var boundaries;

/*
 * Vector
 */
function Vector(x, y) {
    "use strict";
    this.x = x;
    this.y = y;
    this.length = function(){
        return Math.sqrt(this.x*this.x+this.y*this.y);
    };
    this.minus = function(v2){
        return new Vector(this.x-v2.x,this.y-v2.y);
    };
    this.multiply = function(i){
        return new Vector(this.x*i,this.y*i);
    };
    this.divide = function(i){
        return new Vector(this.x/i,this.y/i);
    };
    this.dotProduct = function(v2){
        return this.x*v2.x+this.y*v2.y;
    }
}

/*
 * Circle
 */
function Circle(position, radius, velocity, restitution) {
    "use strict";
    this.radius = radius;
    this.position = position;
    this.mass = radius*radius*Math.PI;
    this.velocity = velocity;
    this.restitution = restitution;
    this.intersectsWith = function(circle){
        var r = Math.pow(this.radius + circle.radius,2);
        return r < Math.pow(this.x+circle.x,2)+Math.pow(this.y+circle.y,2);
    };
    this.resolveCollisionWith = function(entity){
        var relativeVelocity = entity.velocity.minus(this.velocity);
        var velocityAlongNormal = dotProduct(relativeVelocity, normal);
        if(velocityAlongNormal > 0){
            return;
        }
        // Calculate the restitution.
        var e = Math.min(this.restitution, entity.restitution);
        // Calculate the impulse scalar.
        var j = -(1+e) * velocityAlongNormal;
        j /= 1/this.mass + 1/entity.mass;

        // Apply Impulse
        var impulse = j * normal;
        this.velocity -= impulse.multiply(1/this.mass);
        entity.velocity -= impulse.multiply(1/entity.mass);
    };
}

/*
 * Collision
 */
function Collision(a, b, penetration, normal) {
    "use strict";
    this.a = a;
    this.b = b;
    this.penetration = penetration;
    this.normal = normal;
    this.circleVsCircle = function(){
        var r = a.radius + b.radius;
        var n = b.position.minus(a.position);
        var nSquared = Math.pow(n.x, 2)+Math.pow(n.y, 2);
        if(nSquared > Math.pow(r, 2)){
            return false;
        }
        var d = n.length();
        if(d !== 0){
            this.penetration = r - d;
            this.normal = n.divide(d);
        } else {
            this.penetration = a.radius;
            this.normal = new Vector(1,0);
        }
        return true;
    };
}

var initEnvironment = function () {
    "use strict";
    svg = d3.select("#environment").insert("svg").attr("width", w).attr("height", h);
};

var createObservable = function (element, eventType) {
    "use strict";
    return Rx.Observable.create(function (observer) {

        var eventHandler = function (eventObj) {
            observer.onNext(eventObj);
        };
        //adds event listener to the element.
        element.addEventListener(eventType, eventHandler);

        //on dispose
        return function () {
            element.removeEventListener(eventType, eventHandler);
        };
    });
};

var subscribeToClock = function () {
    "use strict";
    clockSubscriber = clockSubscription
        .subscribe(
        function (s) {
            redraw(s);
        },
        function (e) {
            console.log('onError: %s', e);
        },
        function () {
            console.log('onCompleted');
        }
    );
};

var unsubscribeFromClock = function () {
    "use strict";
    clockSubscriber.dispose();
};

var initButtons = function () {
    "use strict";
    createObservable(document.getElementById('subscribeClock'), 'click')
        .subscribe(
            function (evt) {
                subscribeToClock();
            },
            function (err) {
                console.log('error: ' + err);
            },
            function () {
                console.log("complete");
            }
        );
    createObservable(document.getElementById("unsubscribeClock"), 'click')
        .subscribe(
        function (evt) {
            unsubscribeFromClock();
        },
        function (err) {
            console.log('error: ' + err);
        },
        function () {
            console.log("complete");
        }
    );
};

var redraw = function (state) {
    "use strict";
    state.circles
        .filter(function (circle) {
            return circle.drawn === false;
        })
        .map(function (circle) {
            svg.append("circle").attr("r", circle.r)
                .attr("cx", circle.x)
                .attr("cy", circle.y)
                .attr("id", "circle" + circle.id)
                .attr("class", "ball");
            circle.drawn = true;
        }
            );
    state.circles
        .filter(function (circle) {
            return circle.age > 0;
        })
        .map(function (circle) {
            svg
                .select("#circle" + circle.id)
                .attr("cy", circle.y);
        });
};

function initState() {
    "use strict";
    return {
        circles: [
            new Circle(new Vector(w/2,h/2), 30, new Vector(-1,0), 1),
            new Circle(new Vector(w/3,h/2), 20, new Vector(1,0), 1)
        ],
        time: 0,
        update: function (time) {
            this.circles.map(function (circle) {
                if((circle.y + circle.r) < h && (circle.y - circle.r>0)) {
                    circle.y += 2;
                }
            });
            this.time += 1;
            return this;
        }
    };
}

var clockInit = function () {
    "use strict";
    clock = Rx.Observable.timer(
        0, /* 0 seconds */
        10 /* 200 ms */
    );
};

var initClockSubscription = function () {
    "use strict";
    clockSubscription = clock.scan(initState(), function (state, time) {
        return state.update(time);
    });
};

var init = function () {
    "use strict";
    idCounter = 0;
    initButtons();
    initEnvironment();
    clockInit();
    initClockSubscription();
};
