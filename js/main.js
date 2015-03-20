"use strict";

/**
 * Configures require.js to include all required libraries and their dependencies.
 */
require.config({
  paths: {
    d3: '../ext/d3/d3.min',
    bootstrap: '../ext/bootstrap/dist/js/bootstrap.min',
    jquery: '../ext/jquery/dist/jquery.min',
    rx: '../ext/rxjs/dist/rx.all.min',
    physics: 'physics',
    shapes: 'shapes',
    time: 'time',
    utils: 'utils',
    view: 'view',
    app: 'app'
  },
  shim: {
    app: {
      deps: ['utils', 'view', 'shapes', 'physics', 'time', 'rx', 'd3'],
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
