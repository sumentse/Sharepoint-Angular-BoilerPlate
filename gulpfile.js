var browserify = require('browserify'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    source = require('vinyl-source-stream'),
    autoprefixer = require('gulp-autoprefixer'),
    scsso = require('gulp-csso'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    buffer = require('vinyl-buffer')

gulp.task('browserify', function () {
    return browserify('./app/app.js')
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('bundle.min.js'))
        // Start piping stream to tasks!
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps:true}))
            .pipe(uglify())
            .on('error',gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./'));
});

gulp.task('browserify:watchAll', function(){
    gulp.watch(['./app/**/*'], ['browserify']);
});

gulp.task('browserify:watch', function () {
    gulp.watch(['./app/app.js'], ['browserify']);
});


gulp.task('styles', function () {
    return gulp.src('sass/*.scss')
        .pipe(sass({
            sourcemap: true
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('./styles'))
        .pipe(scsso(true))
        .pipe(rename('app.min.css'))
        .pipe(gulp.dest('./styles'));

});

gulp.task('styles:watch', function () {
    gulp.watch('./sass/**/*', ['styles']);
});