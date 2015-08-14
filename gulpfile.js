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
var gulpif = require('gulp-if');

var path = {
  'css': ['node_modules/normalize.css/normalize.css'],
  'scss': ['src/css/**/*.scss'],
  'cssEntrypoint': './src/css/index.scss',
  'html': 'src/index.html',
  'js': ['src/js/**/*.js'],
  'jsEntrypoint': './src/js/index.js',
  'all': ['src/js/**/*.js', 'src/index.html'],
  'minfifiedOut': 'build.min.js',
  'destCss': 'dist/css',
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
  del(['dist'], cb);
});

gulp.task('copy', function() {
  gulp.src(path.html)
    .pipe(gulp.dest(path.dest));
});

/**
 * CSS Task
 *   Add prefixes
 *   Convert SASS to CSS
 *   Base64 (production)
 *   Minify (production)
 *   Concatenate
 *   Copy files
 */
gulp.task('css', function() {
  // Automatically add browser prefixes (e.g. -webkit) when necessary
  var autoprefixer = require('gulp-autoprefixer');
  // Concatenate the files
  var concat = require('gulp-concat');
  // Convert the .scss files into .css
  var sass = require('gulp-sass');
  // We need the to combine the CSS and SCSS streams
  var streamqueue = require('streamqueue');
  // Base 64 encoding of images
  var base64 = require('gulp-base64');
  // Minify the CSS in production
  var minifyCSS = require('gulp-minify-css');

  return streamqueue({
      // Streams that are in object mode can emit generic JavaScript values
      // other than Buffers and Strings.
      objectMode: true
    },
    gulp.src(path.css),
    gulp.src(path.cssEntrypoint)
      .pipe(sass())
      .pipe(autoprefixer({
        // We don't need the visual cascade of prefixes
        // https://github.com/postcss/autoprefixer#visual-cascade
        cascade: false
      })
    ))
    // Base 64 encode certain images
    .pipe(gulpif(isProduction, base64()))
    // Minify CSS
    .pipe(gulpif(isProduction, minifyCSS()))
    // Combine the files
    .pipe(concat('application.css'))
    // Output to the correct directory
    .pipe(gulp.dest(path.destCss))
    .pipe(gulpif(useBrowserSync, browserSync.reload({
      stream: true
    })));
});

/* JavaScript */
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
    if (useBrowserSync) {
      browserSync.reload();
    }
  });
};

gulp.task('prod.js', function() {
  if (!isProduction) {
    return;
  }
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

gulp.task('dev.watch.css', function() {
  if (isProduction) {
    return;
  }
  gulp.watch(path.scss, ['css']);
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

/* HTML */
gulp.task('dev.watch.html', function() {
  if (isProduction) {
    return;
  }
  gulp.watch(path.html, ['copy']);
});

gulp.task('dev.watch', ['dev.watch.css', 'dev.watch.js', 'dev.watch.html']);

gulp.task('build', function(callback) {
  return runSequence(
    'build.clean',
    'copy',
    'dev.watch',
    'dev.browser-sync',
    'prod.js',
    'css',
    callback
  );
});

gulp.task('default', ['build']);
})();
