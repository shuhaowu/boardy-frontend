"use strict";

function Canvas() {
  this.canvas_wrapper = $("#canvas-wrapper");
  this.raw_canvas = document.createElement("canvas");
  this.raw_canvas.innerHTML = "Canvas not supported. Upgrade to a better browser!";
  this.canvas_wrapper.append(this.raw_canvas);

  var resize_canvas = function() {
    var nav_height = $("#nav").outerHeight();
    var controls_height = $("#controls").outerHeight();
    this.canvas_wrapper.css({
      "height": window.innerHeight - nav_height - controls_height,
      "width": window.innerWidth,
      "left": 0,
      "top": 0 + nav_height + controls_height,
      "margin": 0,
      "padding": 0,
      "background-color": "orange"
    });

    this.raw_canvas.width = this.canvas_wrapper.width();
    this.raw_canvas.height = this.canvas_wrapper.height();
  };
  resize_canvas = resize_canvas.bind(this);

  resize_canvas();
  $(window).resize(resize_canvas);

  this.context = this.raw_canvas.getContext("2d");
}
