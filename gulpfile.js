'use strict';

const gulp         = require('gulp'),
	  autoprefixer = require('gulp-autoprefixer'),
	  sourcemaps   = require('gulp-sourcemaps'),
	  csso         = require('gulp-csso'),
	  uglify       = require('gulp-uglify'),
	  rename       = require('gulp-rename'),
	  concat       = require('gulp-concat'),
	  rigger       = require('gulp-rigger'),
	  imagemin     = require('gulp-imagemin'),
	  pngquant     = require('imagemin-pngquant'),
	  browserSync  = require('browser-sync'),
	  del          = require('del');

let path = {
	html: './src/*.html',
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
	return gulp.src(path.html)
			   .pipe(rigger())
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

function vendor_styles() {
	return gulp.src(['./src/styles/vendor.css'].concat(path.vendor.styles))
			   .pipe(concat('vendor.css'))
			   .pipe(csso())
			   .pipe(gulp.dest('./dist/css/'))
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

function vendor_scripts() {
	return gulp.src(['./src/scripts/vendor.js'].concat(path.vendor.scripts))
			   .pipe(concat('vendor.js'))
			   .pipe(uglify())
			   .pipe(gulp.dest('./dist/js/'))
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
	return gulp.src(path.fonts.concat(path.vendor.fonts))
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

	gulp.watch(path.html, views);
	gulp.watch(path.styles, styles);
	gulp.watch(path.scripts, scripts);
}

const build = gulp.series(
	views,
	vendor_styles,
	styles,
	vendor_scripts,
	scripts,
	images,
	fonts
);

gulp.task('build', gulp.series(clean, build));
gulp.task('default', gulp.series('build', watch));
gulp.task('clean', clean);
