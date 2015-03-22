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
    monet: '../ext/monet/src/main/javascript/monet',
    physics: 'physics',
    rx: '../ext/rxjs/dist/rx.all.min',
    shapes: 'shapes',
    time: 'time',
    utils: 'utils',
    vector: 'vector',
    view: 'view'
  },
  shim: {
    app: {
      deps: ['d3', 'monet', 'physics', 'rx', 'shapes', 'time', 'utils', 'vector', 'view'],
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
require(["app", "bootstrap", "d3", "jquery", "monet", "physics", "rx", "shapes", "time", "utils", "vector", "view"], function () {
  init();
});