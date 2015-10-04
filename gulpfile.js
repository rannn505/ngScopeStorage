/**
 * Created by Ran Cohen on 13/06/2015.
 */
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rename = require("gulp-rename");
var del = require('del');

var paths = {
    scripts: ['ngscopestorage.js','!example/**/*.js','!node_modules/**/*.js']
};

gulp.task('clean', function() {
    return del(['dist']);
});

gulp.task('scripts', ['clean'], function() {
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(rename('ngscopestorage.min.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['scripts'], function(){
});