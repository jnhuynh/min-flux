'use strict';

var gulp = require('gulp');
var del = require('del');
var babel = require('gulp-babel');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var mocha = require('gulp-mocha');
var mochaBabelRegister = require('babel/register');

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

gulp.task('test', function() {
  var MinFlux = require('./index');
  var expect = require('chai').expect;


  return gulp.src(['test/**/*.js'], { read: false })
    .pipe(mocha({
      reporter: 'dot',
      require: [
        './index',
        'chai',
      ],
    }));
});

gulp.task('default', ['test']);
