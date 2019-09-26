const browserSync = require('browser-sync').create();
const gulp = require('gulp');
const sass = require('gulp-sass');
const useref = require('gulp-useref');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');

const task = gulp.task;

const css = 'styles';
const html = 'templates';
const js = 'scripts';
const build = 'build';
const watch = 'watch';
const sync = 'browserSync';
const images = 'images';
const fonts = 'fonts';
const clean = 'clean:dist';
const def = 'default';
const dev = 'dev';

const path = {
  html: 'src/templates/**/*.html',
  js: ['src/scripts/**/*.js', 'src/scripts/**/*.json'],
  scss: 'src/styles/**/*.scss',
  images: 'src/assets/**/*.+(png|jpg|gif|svg)',
  fonts: 'src/assets/**/*.+(woff|woff2)'
}

function copyHTML() {
  return gulp.src(path.html)
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }))
};

function sassToCSS() {
  return gulp.src(path.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 3 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
};

function es6ToJS() {
  return gulp.src(path.js)
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }))
};

function minifyImages() {
  return gulp.src(path.images)
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('dist/assets'))
};

function copyFonts() {
  return gulp.src(path.fonts)
    .pipe(gulp.dest('dist/assets'))
};

function deleteDist(callback) {
  return del('dist', callback);
};

function buildFiles(callback) {
  gulp.series(clean, html, css, js, images, fonts)(callback)
};

function reload() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
  })
};

function streamFiles() {
  gulp.watch(path.scss, gulp.series(css), browserSync.reload);
  gulp.watch(path.html, gulp.series(html));
  gulp.watch(path.js, gulp.series(js));
};

// Init

task(html, copyHTML);

task(css, sassToCSS);

task(js, es6ToJS);

task(images, minifyImages);

task(fonts, copyFonts);

task(clean, deleteDist);

task(build, buildFiles);

task(sync, reload);

task(dev, gulp.series(buildFiles, gulp.parallel(sync, streamFiles)));

/*
gulp.task(tasks.ref, function(){
  return gulp.src(path.html)
    .pipe(useref())
    .pipe(gulp.dest('dist'))
});
*/