var createEventObservable = function (element, eventType) {
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