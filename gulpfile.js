'use strict';

const gulp         = require('gulp'),
	  autoprefixer = require('gulp-autoprefixer'),
	  sourcemaps   = require('gulp-sourcemaps'),
	  csso         = require('gulp-csso'),
	  uglify       = require('gulp-uglify'),
	  rename       = require('gulp-rename'),
	  imagemin     = require('gulp-imagemin'),
	  pngquant     = require('imagemin-pngquant'),
	  browserSync  = require('browser-sync'),
	  del          = require('del');

let path = {
	styles: [
		'./src/styles/style.css'
	],
	scripts: [
		'./src/scripts/script.js'
	],
	images: ['./src/images/**/*.*'],
	fonts: ['./src/fonts/**/*.*'],
	vendor: {
		styles: [],
		scripts: [],
		fonts: []
	}
}


function views() {
	return gulp.src('./src/*.html')
		       .pipe(gulp.dest('./html/'))
			   .pipe(browserSync.reload({stream: true}));
}

function styles() {
	return gulp.src(path.styles)
			   .pipe(sourcemaps.init())
			   .pipe(autoprefixer(
				   ['last 15 versions', '> 1%', 'ie 8'],
				   { cascade: true }
			   ))
			   .pipe(csso())
			   .pipe(rename({suffix: '.min'}))
			   .pipe(sourcemaps.write('./'))
			   .pipe(gulp.dest('./dist/css/'))
			   .pipe(browserSync.reload({stream: true}));
}

function scripts() {
	return gulp.src(path.scripts)
			   .pipe(sourcemaps.init())
			   .pipe(uglify())
			   .pipe(rename({suffix: '.min'}))
			   .pipe(sourcemaps.write('./'))
			   .pipe(gulp.dest('./dist/js/'))
			   .pipe(browserSync.reload({stream: true}));
}

function images() {
	return gulp.src(path.images)
			   .pipe(imagemin({
                    progressive: true,
                    svgoPlugins: [{removeViewBox: false}],
                    use: [pngquant()],
                    interlaced: true
                }))
				.pipe(gulp.dest('./dist/img/'));
}

function fonts() {
	return gulp.src(path.fonts)
			   .pipe(gulp.dest('./dist/fonts/'));
}

function clean() {
	return del(['./dist/*', './html/*']);
}

function watch() {
	browserSync.init({
		server: {
		    baseDir: './html',
		    routes: { '/dist': 'dist' }
		},
		notify: false,
		host: 'localhost',
		port: 3000,
		logPrefix: '__MY_PROJECT_NAME__'
    });
}

gulp.task('watch', watch);
gulp.task('style', styles);
gulp.task('js', scripts);
gulp.task('default', views);
gulp.task('clean', clean);
gulp.task('img', images);
