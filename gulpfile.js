const tsFiles = "src/ts/**/*.ts";
const buildDir = "./build/";
const resources = "src/resources/**/*.*";
const jsFiles = "src/js/**/*.js";
const htmlFiles = "src/html/**/*.html";
const certificate = "src/ts/ssl/*.*";
const sourcemaps = require("gulp-sourcemaps");

var del = require("del");
var gulp = require("gulp");
var ts = require("gulp-typescript");

var tsProject = ts.createProject({
    outDir: "build",
    noImplicitAny: true,
    module: "commonjs",
    target: "ES2017"
});


gulp.task("default", function () {
    del([buildDir]).then(() => {
        deploy();
        gulp.watch(tsFiles, ["deploy"]);
        gulp.watch(resources, ["deploy"]);
        gulp.watch(htmlFiles, ["deploy"]);
        gulp.watch(certificate, ["deploy"]);
    });
});


gulp.task("deploy", deploy);

function deploy() {
    gulp.src(tsFiles, { sourcemaps: true })
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .js.pipe(sourcemaps.write()).pipe(gulp.dest(buildDir));
    gulp.src(resources)
        .pipe(gulp.dest(buildDir));
    gulp.src(jsFiles)
        .pipe(gulp.dest(buildDir));
    gulp.src(htmlFiles)
        .pipe(gulp.dest(buildDir));
    gulp.src(certificate)
        .pipe(gulp.dest(buildDir + "/ssl"));
}