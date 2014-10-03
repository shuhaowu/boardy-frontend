"use strict";

module.exports = function(grunt) {
  var ALL_OUR_JS_SOURCES = ["js/src/**/*.js"];

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    jshint: {
      files: ALL_OUR_JS_SOURCES.concat(["Gruntfile.js"]),
      options: {
        browser: true,
        globalstrict: true,
        sub: true,
        expr: true,
        boss: true,
        globals: {
          $: false,
          module: false
        }
      }
    },
    watch: {
      jswatch: {
        files: ALL_OUR_JS_SOURCES,
        tasks: ["jshint"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask("default", ["jshint", "watch"]);
};
