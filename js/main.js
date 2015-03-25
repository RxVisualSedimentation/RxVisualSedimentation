"use strict";

/**
 * Configures require.js to include all required libraries and their dependencies.
 */
require.config({
  paths: {
    app: 'app',
    bootstrap: '../ext/bootstrap/dist/js/bootstrap.min',
    circle: 'shapes/circle',
    collision: 'physics/collision',
    d3: '../ext/d3/d3.min',
    jquery: '../ext/jquery/dist/jquery.min',
    monet: '../ext/monet/src/main/javascript/monet',
    pair: 'physics/pair',
    rx: '../ext/rxjs/dist/rx.all.min',
    state: 'physics/state',
    time: 'time',
    utils: 'utils',
    vector: 'physics/vector',
    view: 'view'
  },
  shim: {
    app: {
      deps: ['d3', 'circle', 'collision', 'monet', 'pair', 'rx', 'state', 'time', 'utils', 'vector', 'view'],
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
require(['app', 'bootstrap', 'circle', 'collision', 'd3', 'jquery', 'monet', 'pair', 'rx', 'state', 'time', 'utils', 'vector', 'view'], function () {
  init();
});