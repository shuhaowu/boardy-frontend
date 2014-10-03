"use strict";

// Used by colorslider.js
['width', 'height'].forEach(function(dimension) {
  var offset, Dimension = dimension.replace(/./, function(m) { return m[0].toUpperCase(); });
  $.fn['outer' + Dimension] = function(margin) {
    var elem = this;
    if (elem) {
      var size = elem[dimension]();
      var sides = {'width': ['left', 'right'], 'height': ['top', 'bottom']};
      sides[dimension].forEach(function(side) {
        if (margin) size += parseInt(elem.css('margin-' + side), 10);
      });
      return size;
    } else {
      return null;
    }
  };
});

function Application() {
}

Application.prototype.initialize = function() {
  this.initialize_canvas();
  $("#initial-loading").remove();
};

Application.prototype.initialize_canvas = function() {
  this.canvas_wrapper = $("#canvas-wrapper");
  this.raw_canvas = document.createElement("canvas");
  this.raw_canvas.innerHTML = "Canvas not supported. Upgrade to a better browser!";
  this.canvas_wrapper.append(this.raw_canvas);

  this.raw_canvas.width = window.innerWidth;
  this.raw_canvas.height = window.innerHeight - $("#nav").outerHeight() - $("#controls").outerHeight();
};

var app = new Application();

$(document).ready(function() {
  app.initialize();
});
