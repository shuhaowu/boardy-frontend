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

  this.$canvas = $(this.raw_canvas);
  this.context = this.raw_canvas.getContext("2d");
  this.$canvas.mousedown(this.on_mousedown.bind(this));
  this.$canvas.mousemove(this.on_mousemove.bind(this));
  this.$canvas.mouseup(this.on_mouseup.bind(this));
  this.$canvas.mouseleave(this.on_mouseleave.bind(this));

  this._points = [];
  this._painting = false;

  this.DEFAULT_PRESSURE = 3;
  this.DEFAULT_COLOR = "#000";

  this.context.strokeStyle = this.DEFAULT_COLOR;
  this.context.lineJoin = "round";
}

Canvas.prototype.get_current_pressure = function() {
  return this.DEFAULT_PRESSURE;
};

Canvas.prototype.record_point = function(e, start) {
  var pressure = this.get_current_pressure();
  var x = e.pageX - e.target.offsetLeft;
  var y = e.pageY - e.target.offsetTop;
  var point = {
    x:     x,
    y:     y,
    p:     pressure,
    start: start
  };

  this._points.push(point);
  return point;
};

Canvas.prototype.draw_path = function(point) {
  if (this._points.length > 1) {
    var last_point = this._points[this._points.length-2];
    this.context.beginPath();
    this.context.moveTo(last_point.x, last_point.y);
    this.context.lineWidth = point.p;
    this.context.lineTo(point.x, point.y);
    this.context.moveTo(point.x, point.y);
    this.context.closePath();
    this.context.stroke();
  }
};

Canvas.prototype.finish_path = function() {
  this._painting = false;
};

Canvas.prototype.on_mousedown = function(e) {
  this._painting = true;
  this.context.beginPath();
  var point = this.record_point(e, true);
  this.context.moveTo(point.x, point.y);
};

Canvas.prototype.on_mousemove = function(e) {
  if (this._painting) {
    var point = this.record_point(e, false);
    this.draw_path(point);
  }
};

Canvas.prototype.on_mouseup = function(e) {
  this.finish_path();
};

Canvas.prototype.on_mouseleave = function(e) {
  this.finish_path();
};
