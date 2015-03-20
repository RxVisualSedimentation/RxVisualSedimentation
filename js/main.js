"use strict";

/**
 * Configures require.js to include all required libraries and their dependencies.
 */
require.config({
  paths: {
    app: 'app',
    bootstrap: '../ext/bootstrap/dist/js/bootstrap.min',
    d3: '../ext/d3/d3.min',
    jquery: '../ext/jquery/dist/jquery.min',
    physics: 'physics',
    rx: '../ext/rxjs/dist/rx.all.min',
    shapes: 'shapes',
    time: 'time',
    utils: 'utils',
    view: 'view'
  },
  shim: {
    app: {
      deps: ['d3', 'physics', 'rx', 'shapes', 'time', 'utils', 'view'],
      exports: 'app'
    },
    bootstrap: {
      deps: ['jquery']
    },
    jquery: {
      exports: 'jQuery'
    }
  }
});

/**
 * Run require.js to actually include all the libraries.
 */
require(["app", "bootstrap", "d3", "jquery", "physics", "rx", "shapes", "time", "utils", "view"], function () {
  init();
});
