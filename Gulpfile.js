
var gulp            = require('gulp');
var gutil           = require('gulp-util');

var jshint          = require('gulp-jshint');
var browserify      = require('browserify');
var source          = require('vinyl-source-stream');
var uglify          = require('gulp-uglify');
var buffer          = require('vinyl-buffer');

var sass            = require('gulp-sass');
var autoprefixer    = require('gulp-autoprefixer');
var browserSync     = require('browser-sync');
var notify          = require('gulp-notify');

var paths           = {
    'sass'            : './public/styles/sass/**/*.scss',
    'css'             : './public/styles/css/',
    'js'              : './public/js/**/*.js',
    'frontEntryPoint' : 'public/js/app.js'
}

browserSync.init({
    server: {
        baseDir: './public/'
    }
});

gulp.task('lint', function() {
  return gulp.src(paths.js)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('scripts', function(){
    browserify(paths.frontEntryPoint)
    .bundle()
    .on('error', function(e){
        gutil.log(e);
        notify(e);
    })
    .pipe(source('app.bundle.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('public/dist/'))
    .pipe(browserSync.stream())
    .pipe(notify("scripts build finished: <%= file.relative %>"));
});
gulp.task('js', ['lint', 'scripts']);


gulp.task('sass', function() {
    return gulp.src(paths.sass)
        .pipe(sass({ style: 'compressed' }).on('error', sass.logError))
        .pipe(autoprefixer('last 10 version'))
        .pipe(gulp.dest(paths.css))
        .pipe(browserSync.stream())
        .pipe(notify("css build finished: <%= file.relative %>"));
});

gulp.task('serve', function(){
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.js,   ['lint', 'scripts']);
    gulp.watch(['./public/*.html']).on('change', browserSync.reload);
});

gulp.task('default', ['js', 'sass', 'serve']);