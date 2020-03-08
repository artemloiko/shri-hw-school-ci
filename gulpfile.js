const { src, dest, parallel, series, watch } = require('gulp');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();

const cssFileOrder = ['src/reset.css', 'src/index.css', 'src/base.blocks/**/*.css', 'src/**/*.css'];

function build() {
  return src(cssFileOrder)
    .pipe(concat('style.css'))
    .pipe(postcss([autoprefixer()]))
    .pipe(dest('dist'))
    .pipe(src('pages/*.html'))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

function buildProd() {
  return src(cssFileOrder)
    .pipe(concat('style.css'))
    .pipe(postcss([autoprefixer()]))
    .pipe(dest('build'))
    .pipe(src('pages/*.html'))
    .pipe(dest('build'));
}

function watchFiles() {
  browserSync.init({ server: './dist', notify: false });
  watch('src/**/*.css', build);
  watch('pages/*.html', build).on('change', browserSync.reload);
}

exports.default = build;
exports.build = buildProd;
exports.watch = series(build, watchFiles);
