var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    browserify = require('gulp-browserify'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    mocha = require('gulp-mocha'),
    chai = require('chai'),
    shell = require('gulp-shell'),
    stringify = require('stringify'),
	packageJSON  = require('./package.json'),
  karma = require('karma'),
	jshintConfig = packageJSON.jshintConfig;

/**
* karma tests
*/

gulp.task('test', function () {
  return karma.server.start({
    configFile: __dirname+'/karma.conf.js',
    singleRun: false
  });
});

/**
* phpunit
*/

gulp.task('test_phpunit', function() {
  return gulp.src('../../app/phpunit.xml', {read: false})
    .pipe(shell([
      'cd ../../app/ && phpunit --colors'
    ]));
});


/**
* style
*/

gulp.task('styles', function() {
    return sass('./css/dev/main.scss') 
	    .on('error', function (err) {
	      console.error('Error!', err.message);
	    })
	    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	    .pipe(gulp.dest('dist/assets/css'))
	    .pipe(rename({suffix: '.min'}))
	    .pipe(minifycss())
	    .pipe(gulp.dest('dist/assets/css'))
        .pipe(notify({ message: 'Styles complete' }));
});

/**
* scripts
*
*/

gulp.task('minify', function() {
  jshintConfig.lookup = false;

  return gulp.src('dist/assets/js/app.js')
   // .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(notify({ message: 'app.js script minify task complete' }));
});

gulp.task('jshint', function() {
  jshintConfig.lookup = false;

  return gulp.src('./js/modules/**/*.js')
    .pipe(jshint(jshintConfig))
    .pipe(jshint.reporter('default'))
   // .pipe(notify({ message: 'jsHint task complete' }));
});

gulp.task('scripts', function() {
	//check modules for syntax and tests
	gulp.start('jshint', 'test');

    // Single entry point to browserify 
    gulp.src(['./js/app.js'])
        .pipe(browserify({
          transform: stringify({
            extensions: ['.html'], minify: true
          }),
          insertGlobals : true,
          debug : !gulp.env.production
        }))
        .pipe(gulp.dest('dist/assets/js'))
});

/**
* main tasks
*/

gulp.task('clean', function(cb) {
    del(['dist/assets/css', 'dist/assets/js'], cb)
});

gulp.task('run', ['clean'], function() {
    gulp.start('styles', 'scripts');
});

gulp.task('default', function() {
	gulp.watch('./css/**/*.scss', ['styles']);
	gulp.watch('./js/**/**/**/*.js', ['scripts']);

	// Create LiveReload server
	livereload.listen();

	// Watch any files in dist/, reload on change
	gulp.watch(['dist/**']).on('change', livereload.changed);
});