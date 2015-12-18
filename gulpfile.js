var gulp = require('gulp'); 
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var rename = require('gulp-concat');

gulp.task('hint', function() {
  return gulp.src('src/ballpark.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('build', function() {
  return gulp.src('src/ballpark.js')
    .pipe(gulp.dest('build'))
    .pipe(rename('ballpark.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build'));
});

// Default Task
gulp.task('default', ['hint', 'build']);