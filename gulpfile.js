'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');
var imagemin = require('gulp-imagemin');
var del = require('del');
var mainBowerFiles = require('main-bower-files');
var gulpFilter = require('gulp-filter');
var imageResize = require('gulp-image-resize');
var pipes = require('gulp-pipes');

gulp.task('nodemon', function (cb) {
	var callbackCalled = false;
	return nodemon({script: './app.js'}).on('start', function () {
		if (!callbackCalled) {
			callbackCalled = true;
			cb();
		}
	});
});

gulp.task('browser-sync', ['nodemon'], function() {
	browserSync.init(null, {
		proxy: "http://localhost:5000"
	});
});

// Scripts
gulp.task('scripts', function() {
	return gulp.src([
			'./app/scripts/utils.js',
			'./app/scripts/parallaxFactory.js',
			'./app/scripts/countdown.js',
			'./app/scripts/core.js',
			'./app/scripts/lock.js',
			'./app/scripts/app.js'
		])
		.pipe(concat('main.js'))
		.pipe(gulp.dest('public/scripts'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(gulp.dest('public/scripts'))
		.resume();
});

// Sass
var sassInput = './app/stylesheets/main.scss';
var jsInput = './app/scripts/**/*.js';
var output = './public/css';
var sassOptions = {
	errLogToConsole: true,
	outputStyle: 'expanded'
};
var autoprefixerOptions = {
	browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};
gulp.task('sass', function() {
	return gulp
		// Find all `.scss` files from the `stylesheets/` folder
		.src(sassInput)
		// Run Sass on those files
		.pipe(sass(sassOptions).on('error', sass.logError))
		// Write the resulting CSS in the output folder
		.pipe(autoprefixer(autoprefixerOptions))
		.pipe(concat('style.css'))
		.pipe(gulp.dest(output))
		.resume();
});

// Image task
gulp.task('images', function() {
	return gulp.src('./app/images/**/*')
		.pipe(imagemin({ optimizationLevel: 0, progressive: true, interlaced: true }))
		.pipe(gulp.dest('public/assets/img'));
});

// Watch
gulp.task('watch', function() {

	// Watch .scss files
	gulp.watch('./app/stylesheets/**/*.scss', ['sass']);

	// Watch .js files
	gulp.watch('./app/scripts/**/*.js', ['scripts']);

});

gulp.task('clean', function(cb) {
	del(['public/css', 'public/scripts'], cb)
});

gulp.task('loadBowerJS', function() {

	var jsFiles = ['src/js/*'];

	gulp.src(mainBowerFiles().concat(jsFiles))
		.pipe(gulpFilter('*.js'))
		.pipe(concat('vendors.js'))
		.pipe(uglify())
		.pipe(gulp.dest('public/scripts/'));

});

// Kicks everything off!
gulp.task('default', ['clean', 'loadBowerJS', 'sass', 'scripts', 'watch', 'browser-sync'], function () {
});
