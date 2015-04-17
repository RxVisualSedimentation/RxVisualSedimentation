"use strict";

/**
 * Configures require.js to include all required libraries and their dependencies.
 */
require.config({
  paths: {
    bootstrap: '../../ext/bootstrap/dist/js/bootstrap.min',
    buttoner: 'buttoner',
    jquery: '../../ext/jquery/dist/jquery.min',
    rx: '../../ext/rxjs/dist/rx.all.min',
    utils: '../utils',
    view: 'view'
  },
  shim: {
    app : {
      deps: ['buttoner','jquery']
    },
    bootstrap: {
      deps: ['jquery']
    },
    view: {
      deps: ['buttoner','jquery']
    },
    websocket: {
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
require(['app', 'bootstrap', 'buttoner', 'jquery', 'rx','utils', 'view'], function () {
  init();
});