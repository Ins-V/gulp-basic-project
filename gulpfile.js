'use strict';

const gulp = require('gulp');

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
		       .pipe(gulp.dest('./html/'))
}

gulp.task('default', views)
