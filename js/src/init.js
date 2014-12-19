"use strict";

window.Document = LocalDocument;

function Application() {
}

Application.prototype.initialize = function() {
  this.canvas = new Canvas();
  this.document = new Document();
  $("#initial-loading").remove();
};


var app = new Application();
$(document).ready(function() {
  app.initialize();
});
