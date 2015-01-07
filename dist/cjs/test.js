"use strict";
var Ember = require("ember")["default"] || require("ember");
//import QUnit from 'qunit'; // Assumed global in runner
var testContext = require("./test-context")["default"] || require("./test-context");

function resetViews() {
  Ember.View.views = {};
}

exports["default"] = function test(testName, callback) {

  function wrapper() {
    var context = testContext.get();

    resetViews();
    var result = callback.call(context);

    function failTestOnPromiseRejection(reason) {
      var message;
      if (reason instanceof Error) {
        message = reason.stack;
      } else {
        message = Ember.inspect(reason);
      }
      ok(false, message);
    }

    Ember.run(function(){
      stop();
      Ember.RSVP.Promise.cast(result)['catch'](failTestOnPromiseRejection)['finally'](start);
    });
  }

  QUnit.test(testName, wrapper);
}
