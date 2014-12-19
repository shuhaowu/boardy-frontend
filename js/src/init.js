"use strict";

var Doc = LocalDocument;

function Application() {
}

Application.prototype.initialize = function() {
  this.canvas = new Canvas();
  this.document = new Doc();
  $("#initial-loading").remove();
};


var app = new Application();
$(document).ready(function() {
  app.initialize();
});
