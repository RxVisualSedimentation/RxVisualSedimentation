var clock;
var clockSub;

function createObservable(element, eventType) {

  return Rx.Observable.create(function (observer) {

    var eventHandler = function (eventObj) {
        observer.onNext(eventObj);
      }
      //adds event listener to the element.
    element.addEventListener(eventType, eventHandler);

    //on dispose
    return function () {
      element.removeEventListener(eventType, eventHandler);
    };
  });
};

function init() {
  initButtons();
  clockInit();
}

function initButtons() {
  //button
  createObservable(document.getElementById('subClock'), 'click')
    .subscribe(
      function (evt) {
        subscribeToClock()
      },
      function (err) {
        console.log('error: ' + err);
      },
      function () {
        console.log("complete");
      }
  );

  createObservable(document.getElementById('unsubClock'), 'click')
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
}

function multiObserverables() {
  // Creates an observable sequence of 5 integers, starting from 1
  var a = Rx.Observable.range(1, 10);
  var b = Rx.Observable.range(5, 10)

  var observer = Rx.Observer.create(
    function (x) {
      console.log('onNext: %s', x);
    },
    function (e) {
      console.log('onError: %s', e);
    },
    function () {
      console.log('onCompleted');
    }
  );

  var x = Rx.Observable.zip(a, b, function (a1, b1) {
      return a1 * b1;
    })
    .subscribe(observer);
}

function clockInit() {
  source = Rx.Observable.timer(
    0, /* 0 seconds */
    250 /* 250 ms */
  )
  clock = source.publish();
  clock.connect();
}

function unsubscribeFromClock() {
  clockSub.dispose();
}

function subscribeToClock() {
  clockSub = clock.subscribe(function (x) {
      console.log('Tic: %s', x);
    },
    function (e) {
      console.log('onError: %s', e);
    },
    function () {
      console.log('onCompleted');
    }
  );
}



$(document).ready(init);