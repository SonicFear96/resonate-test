const { src, dest, series, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const csso = require("gulp-csso");
const htmlmin = require("gulp-htmlmin");
const del = require("del");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const sync = require("browser-sync").create();
const gulp = require("gulp");
const ghPages = require("gulp-gh-pages");

gulp.task("deploy", function () {
  return gulp.src("./dest/**/*").pipe(ghPages());
});

function html() {
  return src("src/**.html")
    .pipe(
      htmlmin({
        collapseWhitespace: true,
      })
    )
    .pipe(dest("dist"));
}

function scss() {
  return src("src/scss/**scss")
    .pipe(sass())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions"],
      })
    )
    .pipe(csso())
    .pipe(concat("style.css"))
    .pipe(dest("dist"));
}

function clear() {
  return del("dist");
}

function image() {
  return src("src/img/**/*.{png,jpg,svg}").pipe(dest("dist/img"));
}

function serve() {
  sync.init({
    server: "./dist",
  });

  watch("src/**.html", series(html)).on("change", sync.reload);
  watch("src/scss/**/*.scss", series(scss)).on("change", sync.reload);
}

exports.build = series(clear, scss, html, image);
exports.start = series(clear, scss, html, image, serve);
