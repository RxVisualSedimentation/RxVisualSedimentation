"use strict";

/**
 * Initializes RxVisualSedimentation
 */
var init = function () {
  initButtons();
  initClockObversable();
  initStateObservable();
  initEnvironment();
  initWebsocket();
};
