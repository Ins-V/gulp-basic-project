'use strict';

const gulp         = require('gulp'),
	  autoprefixer = require('gulp-autoprefixer'),
	  sourcemaps   = require('gulp-sourcemaps'),
	  csso         = require('gulp-csso'),
	  uglify       = require('gulp-uglify'),
	  browserSync  = require('browser-sync');

let path = {
	styles: [
		'./src/styles/style.css'
	],
	scripts: [
		'./src/scripts/script.js'
	],
	images: [],
	fonts: [],
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
			   .pipe(sourcemaps.write('./'))
			   .pipe(gulp.dest('./dist/css/'))
			   .pipe(browserSync.reload({stream: true}));
}

function scripts() {
	return gulp.src(path.scripts)
			   .pipe(sourcemaps.init())
			   .pipe(uglify())
			   .pipe(sourcemaps.write('./'))
			   .pipe(gulp.dest('./dist/js/'))
			   .pipe(browserSync.reload({stream: true}));
}

gulp.task('server', () => {
	browserSync({
		server: {
		    baseDir: './html',
		    routes: { '/dist': 'dist' }
		},
		notify: false,
		host: 'localhost',
		port: 3000,
		logPrefix: '__MY_PROJECT_NAME__'
	});
});

gulp.task('style', styles);
gulp.task('js', scripts);
gulp.task('default', views);
