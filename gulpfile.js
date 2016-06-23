var LessPluginAutoPrefix = require('less-plugin-autoprefix');
var LessPluginCleanCSS = require('less-plugin-clean-css');
var browserify = require('browserify');
var browserSync = require('browser-sync').create();
var del = require('del');
var gulp = require('gulp');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');

var SRC_DIR = './src/';
var BUILD_DIR = './build/';

/**
 * Tasks for generating and watching scripts in development/debug mode.
 */

function devMarkup() {
  return gulp.src(SRC_DIR + 'index.html')
      .pipe(gulp.dest(BUILD_DIR))
      .pipe(browserSync.reload({stream: true}));
}
gulp.task('dev-markup', devMarkup);

function devScripts() {
  return browserify(SRC_DIR + 'main.js', {debug: true})
     .bundle()
     .pipe(source('main.js'))
     .pipe(buffer())
     .pipe(sourcemaps.init({loadMaps: true}))
     .pipe(sourcemaps.write('./'))
     .pipe(gulp.dest(BUILD_DIR))
     .pipe(browserSync.stream());
}
gulp.task('dev-scripts', devScripts);

function devStyles() {
  var stream = gulp.src(SRC_DIR + 'main.less')
      .pipe(sourcemaps.init())
      .pipe(less({
        relativeUrls: true,
        plugins: [new LessPluginAutoPrefix()]
      }))
      .on('error', function(err) {
        gutil.log('LESS compilation failed: ' + err.message);
        browserSync.notify(err.message, 30000);
        stream.end();
      })
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(BUILD_DIR))
      .pipe(browserSync.stream());
  return stream;
}
gulp.task('dev-styles', devStyles);

function devAssets() {
  return gulp.src(SRC_DIR + '**/assets/**')
      .pipe(gulp.dest(BUILD_DIR))
      .pipe(browserSync.stream());
}
gulp.task('dev-assets', devAssets);

gulp.task('dev-browser-sync', function(done) {
  return browserSync.init({
    server: {
      baseDir: BUILD_DIR
    },
    open: false,
    ghostMode: false
  }, done);
});

gulp.task('dev-build', gulp.parallel([
  'dev-markup',
  'dev-scripts',
  'dev-styles',
  'dev-assets'
]));

gulp.task('dev-serve', gulp.series('dev-build', 'dev-browser-sync'));

gulp.task('dev-watch', function(done) {
  gulp.watch(SRC_DIR + 'index.html', devMarkup);
  gulp.watch(SRC_DIR + '**/*.js', devScripts);
  gulp.watch(SRC_DIR + '**/*.less', devStyles);
  gulp.watch(SRC_DIR + '**/assets/**', devAssets);
  done();
});

gulp.task('dev', gulp.parallel('dev-serve', 'dev-watch'));

/**
 * Tasks for generating markup, scripts, stylesheets, and other assets for
 * distribution/deployment.
 */

gulp.task('dist-clean', function() {
  return del(BUILD_DIR + '**/*');
});

gulp.task('dist-markup', function() {
  return gulp.src(SRC_DIR + 'index.html').pipe(gulp.dest(BUILD_DIR));
});

gulp.task('dist-scripts', function() {
  return browserify(SRC_DIR + 'main.js').bundle()
      .pipe(source('main.js'))
      .pipe(buffer())
      .pipe(uglify({compress: true}))
      .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('dist-styles', function() {
  return gulp.src(SRC_DIR + 'main.less')
      .pipe(less({
        relativeUrls: true,
        plugins: [new LessPluginAutoPrefix(), new LessPluginCleanCSS()]
      }))
      .on('error', function(err) {
        gutil.log('LESS compilation failed: ' + err.message);
        process.exit(1);
      })
      .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('dist-assets', function() {
  return gulp.src(SRC_DIR + '**/assets/**')
      .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('dist-build', gulp.parallel([
  'dist-markup',
  'dist-scripts',
  'dist-styles',
  'dist-assets'
]));

gulp.task('dist', gulp.series('dist-clean', 'dist-build'));
