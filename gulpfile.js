const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const cleancss = require("gulp-clean-css");
const sassGlob = require("gulp-sass-glob");

const del = require("del");

function style() {
  return gulp
    .src("app/scss/style.scss")
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(
      autoprefixer({ overrideBrowserslist: ["last 10 versions"], grid: true })
    )
    .pipe(
      cleancss({
        level: { 1: { specialComments: 0 } },
        format: "beautify",
      })
    )
    .pipe(gulp.dest("app/css/"))
    .pipe(browserSync.stream());
}

function watch() {
  gulp.watch("app/scss/**/*.scss", style);
  gulp.watch("app/**/*.html").on("change", browserSync.reload);
}

function buildcopy() {
  return gulp
    .src(["app/css/**/*css", "app/assets/**/*", "app/**/*.html"], {
      base: "app",
    })
    .pipe(gulp.dest("dist"));
}
function cleandist() {
  return del("dist/**/*", { force: true });
}
function browsersync() {
  browserSync.init({
    server: { baseDir: "app/" },
    notify: false,
    online: true,
  });
}
exports.style = style;
exports.watch = watch;

exports.build = gulp.series(cleandist, style, buildcopy);

exports.default = gulp.parallel(style, browsersync, watch);
