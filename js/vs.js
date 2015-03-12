var clock;
var clockSubscription;
var clockSubscriber;
var idCounter;

var svg;
var w = 800,
    h = 600;
var boundaries;

/*
 * Ball
 */
function Ball(x, y, r, t) {
    "use strict";
    this.drawn = false;
    this.x = x;
    this.y = y;
    this.r = r;
    this.age = t;
    this.id = idCounter;
    idCounter += 1;
}

/*
 * Ground
 */
function Ground(x, y, h, w) {
    "use strict";
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
}

var initEnvironment = function () {
    "use strict";
    boundaries = [
        new Ground(0, h - 20, 20, w)
    ];
    svg = d3.select("#environment").insert("svg").attr("width", w).attr("height", h);

    boundaries.forEach(function (element) {
        var boundary = element;
        svg.append("rect").attr("x", boundary.x)
            .attr("y", boundary.y)
            .attr("height", boundary.h)
            .attr("width", boundary.w)
            .attr("class", "boundary");
    });
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
            new Ball(w / 2, h / 8, 30, 1.03, -1),
            new Ball(w / 3, h / 8, 20, 1.03, -1)
        ],
        time: 0,
        update: function (time) {
            this.circles.map(function (circle) {
                circle.age += 1;
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

$(document).ready(init);