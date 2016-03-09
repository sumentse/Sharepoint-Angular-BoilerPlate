var browserify = require('browserify'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    source = require('vinyl-source-stream'),
    autoprefixer = require('gulp-autoprefixer'),
    scsso = require('gulp-csso'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    buffer = require('vinyl-buffer'),
    notify = require('gulp-notify');

gulp.task('browserify', function () {
    return browserify('./app/app.js')
        .bundle()
            .on('error', function(err){
                console.log(err.message);
                return notify("Browserify " + err).write(err);
            })
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('bundle.min.js'))
        // Start piping stream to tasks!
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps:true}))
            .pipe(uglify())
            .on('error', function(err){
                console.log(err.message);
                return notify("Uglify " + err).write(err);
            })
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