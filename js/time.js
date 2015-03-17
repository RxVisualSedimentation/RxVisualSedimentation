
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
