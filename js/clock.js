function init() {
  
  var ob = Rx.Observer.create(
    function (x) {
      console.log(x);
    },
    function (e) {
      console.log('onError: %s', e);
    },
    function () {
      console.log('onCompleted');
    }
  );
  
//  var source = Rx.Observable.create(function (ob) {
//    
//  });
  
  $("button").on( "click", function(e) {
    ob.onNext(e);
  });
  
  
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
var sub;
var source;
var observer;
var hot;

function clockInit() {
  source = Rx.Observable.timer(
    0, /* 0 seconds */
    250 /* 250 ms */
  )
  hot = source.publish();

  observer = Rx.Observer.create(
    function (x) {
      console.log('Tic: %s', x);
    },
    function (e) {
      console.log('onError: %s', e);
    },
    function () {
      console.log('onCompleted');
    }
  );
  disposable = hot.connect();
}

function unsubscribe() {
  sub.dispose();
}

function subscribe() {
  sub = hot.subscribe(observer);
}