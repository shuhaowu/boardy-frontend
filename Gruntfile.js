"use strict";

module.exports = function(grunt) {

  var VENDOR_SOURCES_IN_ORDER = [
    "js/vendor/**/*.js",
  ];

  var DEV_JS_SOURCES_IN_ORDER = [
    "js/src/common.js",
    "js/src/canvas.js",
    "js/src/local.js",
    "js/src/remote.js",
    "js/src/init.js",
  ];

  var TEST_JS_SOURCES_IN_ORDER = [
    "tests/test_init.js",
    "tests/**/*_tests.js",
  ];

  var ALL_OUR_JS_SOURCES = DEV_JS_SOURCES_IN_ORDER.concat(TEST_JS_SOURCES_IN_ORDER);
  var ALL_JS_SOURCES = VENDOR_SOURCES_IN_ORDER.concat(ALL_OUR_JS_SOURCES);
  var KARMA_JS_SOURCES = ALL_JS_SOURCES.slice();
  KARMA_JS_SOURCES.splice(KARMA_JS_SOURCES.indexOf("js/src/init.js"), 1);

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
          // All boardy objects
          Title: false,
          Canvas: false,
          LocalDocument: false,

          $: false,
          module: false,
          console: false,

           // jasmine stuff
          describe: false,
          expect: false,
          it: false,
          beforeEach: false,
          afterEach: false,
          jasmine: false,
        }
      }
    },
    karma: {
      dev: {
        options: {
          files: KARMA_JS_SOURCES
        },
        configFile: "test.conf.js",
        background: true,
        autoWatch: false
      },
      ci: {
        options: {
          files: VENDOR_SOURCES_IN_ORDER.concat(["build/boardy.min.js"]).concat(TEST_JS_SOURCES_IN_ORDER)
        },
        configFile: "test.conf.js",
        background: false,
        singleRun: true,
        browsers: ["Firefox"],
        reporters: "dots"
      }
    },
    uglify: {
      prod: {
        files: {
          "build/boardy.min.js": DEV_JS_SOURCES_IN_ORDER
        }
      }
    },
    watch: {
      options: {
        atBegin: true
      },
      jswatch: {
        files: ALL_OUR_JS_SOURCES,
        tasks: ["jshint", "karma:dev:run"]
      }
    },
  });

  // I know this is shitty, but I don't have a better solution right now
  grunt.registerTask("wait", "waits a couple of seconds until karma starts everything", function() {
    var done = this.async();
    setTimeout(function() {
      done(true);
    }, 5000);
  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks("grunt-karma");

  grunt.registerTask("default", ["karma:dev:start", "wait", "watch"]);
  grunt.registerTask("prod", ["jshint", "uglify:prod", "karma:ci:start"]);
};
