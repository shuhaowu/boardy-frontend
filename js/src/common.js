"use strict";

// Zepto addon
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

// Common stuff
function Title(save) {
  this.elem = $("#document-title");
  this.controls = $("#title-edit");
  this.save_elem = this.controls.children(".fa-save").first();
  this.cancel_elem = this.controls.children(".fa-rotate-left").first();

  this.elem.click(this.begin_edit.bind(this));
  this.save_elem.click(this.save_edit.bind(this));
  this.cancel_elem.click(this.cancel_edit.bind(this));

  this.detect_keys = this.detect_keys.bind(this);
  this.save = save;
}

Title.prototype.detect_keys = function(e) {
  if (e.keyCode == 13) { // enter key
    this.save_edit();
    return false;
  } else if (e.keyCode == 27) { // escape
    this.cancel_edit();
    return false;
  }
  return true;
};

Title.prototype.begin_edit = function() {
  this._old_title = this.elem.text();
  this.elem.attr("contenteditable", "true");
  this.controls.css("display", "inline");
  this.elem.focus();
  this.elem.on("keydown", this.detect_keys);
};

Title.prototype.done = function() {
  this.elem.attr("contenteditable", null);
  delete this._old_title;
  this.controls.css("display", "none");
  this.elem.off("keydown");
};

Title.prototype.cancel_edit = function() {
  this.elem.text(this._old_title);
  this.done();
};

Title.prototype.save_edit = function() {
  this.done();
  var new_title = $.trim(this.elem.text());
  if (!new_title) {
    new_title = "Untitled";
  }

  this.elem.html(new_title);
  if (this.save) {
    this.save(new_title);
  }
};
