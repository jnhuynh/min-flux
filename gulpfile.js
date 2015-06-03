'use strict';

var gulp = require('gulp');
var del = require('del');
var babel = require('gulp-babel');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var buildDestination = 'build'

gulp.task('build', function() {
  del([buildDestination], function() {
    var bundleStream = browserify({
      entries: './index.js',
      debug: true,
    }).bundle();

    return bundleStream
      .pipe(source('min-flux.js'))
      .pipe(buffer())
      .pipe(babel())
      .pipe(gulp.dest(buildDestination));
  });
});
