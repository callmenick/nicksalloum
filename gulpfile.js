'use strict';

var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var cp = require('child_process');
var gulp = require('gulp');
var moment = require('moment');
var scss = require('gulp-sass');

(function() {
  'use strict';

  gulp.task('styles', function() {
    return gulp.src('./scss/**/*.scss')
      .pipe(scss({
        outputStyle: 'expanded'
      }).on('error', scss.logError))
      .pipe(autoprefixer())
      .pipe(gulp.dest('./css'))
      .pipe(browserSync.stream());
  });

  gulp.task('serve', ['styles'], function() {
    browserSync.init({
      server: './'
    });

    gulp.watch('./scss/**/*.scss', ['styles']);
    gulp.watch('./*.html').on('change', browserSync.reload);
  });

  gulp.task('deploy', ['build'], function() {
    addAll()
      .then(commit)
      .then(push)
      .then(function() {
        console.log('Done');
      })
      .catch(function(err) {
        console.log('Error:', err);
      });
  });

  // build and default tasks
  gulp.task('build', ['styles']);
  gulp.task('default', ['styles']);

  function addAll() {
    return new Promise((resolve, reject) => {
      var ps = cp.spawn('git', ['add', '.']);

      ps.stdout.on('data', function(data) { console.log(data.toString()); });
      ps.stderr.on('data', function(data) { console.log(data.toString()); });
      ps.on('close', function(code) {
        code === 0
          ? resolve()
          : reject({
            ok: false,
            code: 500,
            message: 'Failed to add all.'
          });
      });
    });
  }

  function commit() {
    return new Promise((resolve, reject) => {
      var ts = moment().format('YYYY-MM-DD H:mm:ss');
      var ps = cp.spawn('git', ['commit', '-m', ts]);

      ps.stdout.on('data', function(data) { console.log(data.toString()); });
      ps.stderr.on('data', function(data) { console.log(data.toString()); });
      ps.on('close', function(code) {
        code === 0
          ? resolve()
          : reject({
            ok: false,
            code: 500,
            message: 'Failed to commit.'
          });
      });
    });
  }

  function push() {
    return new Promise((resolve, reject) => {
      var ps = cp.spawn('git', ['push', 'origin', 'master']);

      ps.stdout.on('data', function(data) { console.log(data.toString()); });
      ps.stderr.on('data', function(data) { console.log(data.toString()); });
      ps.on('close', function(code) {
        code === 0
          ? resolve()
          : reject({
            ok: false,
            code: 500,
            message: 'Failed push changes.'
          });
      });
    });
  }
})();
