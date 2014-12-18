"use strict";

beforeEach(function() {
  jasmine.addMatchers({
    toBeHidden: function() {
      return {
        compare: function(element) {
          return {
            pass: $(element).css("display") == "none"
          };
        }
      };
    },
    toBeVisible: function() {
      return {
        compare: function(element) {
          return {
            pass: $(element).css("display") != "none"
          };
        }
      };
    }
  });
});
