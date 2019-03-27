'use strict';

const gulp         = require('gulp'),
	  autoprefixer = require('gulp-autoprefixer'),
	  sourcemaps   = require('gulp-sourcemaps'),
	  csso         = require('gulp-csso');

let path = {
	styles: [
		'./src/styles/style.css'
	],
	scripts: [
		'./scr/scripts/script.js'
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
		       .pipe(gulp.dest('./html/'));
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
			   .pipe(gulp.dest('./dist/css/'));
}

gulp.task('style', styles);
gulp.task('default', views);
