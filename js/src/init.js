"use strict";

var Doc = LocalDocument;

function Application() {
}

Application.prototype.initialize = function() {
  this.canvas = new Canvas();
  this.document = new Doc();
  $("#initial-loading").remove();

  var controls = $("#controls");
  this.buttons = {};
  this.buttons.new = $(".fa-file-o", controls).parent();
  this.buttons.export = $(".fa-download", controls).parent();
  this.buttons.undo = $(".fa-undo", controls).parent();
  this.buttons.redo = $(".fa-redo", controls).parent();
  this.buttons.share = $(".fa-file-o", controls).parent();
  this.buttons.settings = $(".fa-cog", controls).parent();
  this.buttons.share = $(".fa-share-alt", controls).parent();

  this.buttons.undo.on("click", this.canvas.undo.bind(this.canvas));
};


var app = new Application();
$(document).ready(function() {
  app.initialize();
});
