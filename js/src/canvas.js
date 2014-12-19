"use strict";

function Canvas() {
  this.canvas_wrapper = $("#canvas-wrapper");
  this.raw_canvas = document.createElement("canvas");
  this.raw_canvas.innerHTML = "Canvas not supported. Upgrade to a better browser!";
  this.canvas_wrapper.append(this.raw_canvas);

  var resize_canvas = function() {
    var $nav = $("#nav");
    var $controls = $("#controls");
    var nav_height = $nav.length > 0 ? $nav.outerHeight() : 0;
    var controls_height = $controls.length > 0 ? $controls.outerHeight() : 0;
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
    this.restore(this._actions);
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
  this.$canvas.on("contextmenu", function(e) {
    e.preventDefault();
  });
  $(document).keydown(this.on_keydown.bind(this));

  this._current_action = null;
  this._actions = [];
  this._actions_undone = [];

  this.DEFAULT_PRESSURE = 3;
  this.DEFAULT_COLOR = "#000";

  this.context.strokeStyle = this.DEFAULT_COLOR;
  this.context.lineJoin = "round";

  this._event_handlers = {
    starting_pen_path: [],
    ending_pen_path:   [],
    canvas_restored:   []
  };
}

Canvas.prototype.bind = function(ev, f) {
  var l = this._event_handlers[ev];
  if (l) {
    l.push(f);
  } else {
    throw "event '" + ev + "' doesn't exist";
  }
};

Canvas.prototype.trigger = function(ev, event_obj) {
  var handlers = this._event_handlers[ev];
  if (handlers) {
    event_obj = event_obj || {};
    event_obj.canvas = this;
    for (var i=0; i<handlers.length; i++) {
      // TODO: preventDefault? Or Canvas gotta can?
      handlers[i](event_obj);
    }
  }

  return true;
};

Canvas.prototype.clear = function() {
  this.context.clearRect (0 , 0 , this.raw_canvas.width, this.raw_canvas.height);
};


// O(n) restore time may be bad
Canvas.prototype.restore = function(actions) {
  if (!actions) {
    // This is probably the first resize_canvas we called
    return;
  }

  this.clear();
  this._actions = [];
  for (var i=0, l=actions.length; i<l; i++) {
    switch (actions[i].action) {
      case "path":
        var points = actions[i].points;
        if (points.length <= 1) {
          // 0 => huh?
          // 1 => might be an interesting case to worry about later
          console.warn("points length <= 1")
          continue;
        }

        this.start_path(points[0], true);
        for (var j=1, k=points.length; j<k; j++) {
          this.draw_path(points[j], points[j-1]);
        }
        this.end_path(null, points[points.length-1], true)
      break;
    }
    this._actions.push(actions[i]);
  }
  this.trigger("canvas_restored");
};

Canvas.prototype.get_current_pressure = function() {
  return this.DEFAULT_PRESSURE;
};

Canvas.prototype.get_point_from_event = function(e) {
  var pressure = this.get_current_pressure();
  var x = e.pageX - e.target.offsetLeft;
  var y = e.pageY - e.target.offsetTop;
  return {
    x:     x,
    y:     y,
    p:     pressure,
  };
};


Canvas.prototype.start_path = function(point, is_restore) {
  if (!is_restore) {
    this.trigger("starting_pen_path", {point: point});
  }

  this._current_action = {action: "path", points: [point]};
};

Canvas.prototype.end_path = function(reason, point, is_restore) {
  if (!this._current_action || this._current_action.action !== "path") {
    return;
  }

  if (!is_restore) {
    this.trigger("ending_pen_path", {point: point, reason: reason});
    this._actions.push(this._current_action);
  }

  this._current_action = null;
};

Canvas.prototype.draw_path = function(point, last_point) {
  this.context.beginPath();
  this.context.moveTo(last_point.x, last_point.y);
  this.context.lineWidth = point.p;
  this.context.lineTo(point.x, point.y);
  this.context.moveTo(point.x, point.y);
  this.context.closePath();
  this.context.stroke();
};

Canvas.prototype.undo_path = function() {
  // Such a hack. Undo path requires a restore. Restores are very slow,
  // but it is more perfect.
  for (var l=this._points.length, i=l-1; i>=0; i--) {
    if (this._points[i].start) {
      break;
    }
  }

  this._points.splice(i, Number.MAX_VALUE);
  this.restore(this._points);
};

Canvas.prototype.undo = function() {
  // just this for now. As there are more things there will be more kinds of undos.
  this.undo_path();
};

Canvas.prototype.on_mousedown = function(e) {
  var point = this.get_point_from_event(e);
  switch(e.which) {
    case 1: // Left click, draw stuff
      this.start_path(point);
    break;
    case 2: // middle click
    break;
    case 3: // right click
    break;
  }
};

Canvas.prototype.on_mousemove = function(e) {
  if (this._current_action) {
    var point = this.get_point_from_event(e);
    this.draw_path(point, this._current_action.points[this._current_action.points.length-1]);
    this._current_action.points.push(point);
  }
};

Canvas.prototype.on_mouseup = function(e) {
  this.end_path("mouseup", this.get_point_from_event(e));
};

Canvas.prototype.on_mouseleave = function(e) {
  this.end_path("mouseleave", this.get_point_from_event(e));
};

Canvas.prototype.on_keydown = function(e) {
  if (e.ctrlKey) {
    switch (e.keyCode) {
      case 83: // s
        e.preventDefault();
      break;
      case 90: // z
        this.undo();
        e.preventDefault();
      break;
    }
  }
};
