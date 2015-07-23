(function() {
'use strict';

var $ = require('gulp-load-plugins')();
var babelify = require('babelify');
var browserify = require('browserify');
var del = require('del');
var gulp = require('gulp');
var minimist = require('minimist');
var prettyTime = require('pretty-hrtime');
var runSequence = require('run-sequence');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var browserSync = require('browser-sync').create();

var path = {
  'html': 'src/index.html',
  'js': ['src/js/**/*.js'],
  'jsEntrypoint': './src/js/app.js',
  'all': ['src/js/**/*.js', 'src/index.html'],
  'minfifiedOut': 'build.min.js',
  'destJs': 'dist/js',
  'dest': 'dist',
  'out': 'build.js'
};

// Base options for the command line
var baseOptions = {
  'string': 'env',
  'boolean': 'browsersync',
  'default': {
    'env': process.env.NODE_ENV || 'development',
    'browsersync': true
  }
};

// Slice all the command options and set the defaults
var options = minimist(process.argv.slice(2), baseOptions);

// Are we in production mode?
var isProduction = options.env === 'production';

// If not development mode, BrowserSync is turned off
// Otherwise, in development mode, BrowserSync set by options
var useBrowserSync = options.env !== 'development' ? false : options.browsersync;

gulp.task('build.clean', function(cb) {
  del(['public'], cb);
});

gulp.task('copy', function() {
  gulp.src(path.html)
    .pipe(gulp.dest(path.dest));
});

var bundler = browserify({
  'entries': [path.jsEntrypoint],
  'transform': [babelify],
  'debug': true,
  'cache': {},
  'packageCache': {},
  'fullPaths': true
});

var bundleIt = function(bundle) {
  return bundle.bundle()
    .pipe(source(path.out))
    .pipe(gulp.dest(path.destJs))
    .on('end', function() {
    console.log('hey');
    if (useBrowserSync) {
      browserSync.reload();
    }
  });
};

gulp.task('prod.js', function() {
  return bundleIt(bundler);
});

/**
 *  Initialized BrowserSync
 */
gulp.task('dev.browser-sync', function() {
  if (!useBrowserSync) {
    return;
  }

  return browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
});

gulp.task('dev.watch.js', function() {
  if (isProduction) {
    return;
  }
  var watcher = watchify(bundler);

  var taskName = this.seq[0];
  watcher.on('update', function() {
    // Create new bundle that uses the cache for high performance
    return bundleIt(watcher);
  }).on('time', function(time) {
    $.util.log(
      'Finished', '\'' + $.util.colors.cyan('watchify') + '\'',
      'after', $.util.colors.magenta(prettyTime(time))
    );
  });

  return bundleIt(watcher);
});

gulp.task('dev.watch.html', function() {
  if (isProduction) {
    return;
  }
  gulp.watch(path.html, ['copy']);
});

gulp.task('dev.watch', ['dev.watch.js', 'dev.watch.html']);

gulp.task('build', function(callback) {
  return runSequence(
    'build.clean',
    'copy',
    'dev.watch',
    'dev.browser-sync',
    callback
  );
});

gulp.task('default', ['build']);
})();
