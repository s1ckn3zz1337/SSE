const tsFiles = "src/ts/**/*.ts";
const buildDir = "./build/";
const resources = "src/resources/**/*.*";
const jsFiles = "src/js/**/*.js";
const htmlFiles = "src/html/**/*.html";

var del = require("del");
var gulp = require("gulp");
var ts = require("gulp-typescript");

var tsProject = ts.createProject({
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
    });
});


gulp.task("deploy", deploy);

function deploy() {
    gulp.src(tsFiles)
        .pipe(tsProject())
        .js.pipe(gulp.dest(buildDir));
    gulp.src(resources)
        .pipe(gulp.dest(buildDir));
    gulp.src(jsFiles)
        .pipe(gulp.dest(buildDir));
    gulp.src(htmlFiles)
        .pipe(gulp.dest(buildDir));
}