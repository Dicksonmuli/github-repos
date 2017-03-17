// make dependencies listed on json files to be available
// on our html

var gulp = require('gulp');
var browserify = require ('browserify');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var utilities = require('gulp-util');
var buildProduction = utilities.env.production;
var jshint = require('gulp-jshint');
var del = require('del');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var lib = require('bower-files')({
  "overrides":{
    "bootstrap":{
      "main":[
        "less/bootstrap.less",
        "dist/css/bootstrap.css",
        "dist/js/bootstrap.js"
      ]
    }
  }
});

// gulp-tasks

gulp.task('serve', function () {
  browserSync.init({
    server:{
      baseDir:"./",
      index: "index.html"
    }
  })
  gulp.watch(['js/*.js'], ['jsBuild']);
  gulp.watch(['bower.json'], ['bowerBuild']);
  gulp.watch(['*html'],['htmlBuild']);
  gulp.watch(['scss/*.scss'],['cssBuild']);
})
//defining cssBuild task and can be run as a standalone
//compiles the scss files to css file and stores them in buil/css
//directory
gulp.task('cssBuild', function () {
  return gulp.src(['scss/*.scss'])
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./build/css'))
  .pipe(browserSync.stream());
});


//reloads the jsBrowserify and jshint whenever .js changes
gulp.task('jsBuild', ['jsBrowserify', 'jshint'], function(){
  browserSync.reload();
});

gulp.task('htmlBuild', function() {
  browserSync.reload();
});

//reloads the jsBrowserify and jshint whenever bower files changes
gulp.task('bowerBuild', ['bower'], function(){
  browserSync.reload();
});

// consolidating JavaScript file into one.
// this is to optimise our code by reducing load time.
gulp.task('concatInterface', function() {
  return gulp.src(['./js/*-interface.js'])
    .pipe(concat('allConcat.js'))
    .pipe(gulp.dest('./tmp'));
});
// minifyScripts here is used remove all unnecessary
// characters in JavaScript while preserving its functionality
gulp.task("minifyScripts", ["jsBrowserify"], function(){
  return gulp.src("./build/js/app.js")
    .pipe(uglify())
    .pipe(gulp.dest("./build/js"));
});

//uses gulp to streamline JS file in browser instead of reloading over
// over again
gulp.task('bowerJS', function () {
  return gulp.src(lib.ext('js').files)
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'));
});

//uses gulp to streamline CSS file in browser instead of reloading over
// over again
gulp.task('bowerCSS', function () {
  return gulp.src(lib.ext('css').files)
  .pipe(concat('vendor.css'))
  .pipe(gulp.dest('./build/css'))
})

gulp.task('bower', ['bowerJS', 'bowerCSS'])

// browserify  package used to translate the code in node
// to a languange that the browser understands using some
// keywords.
//It makes files ready for the browser
// Runs concatInterface first then stores what is concatinated into
// build
gulp.task('jsBrowserify', ['concatInterface'], function () {
  return browserify({entries:['./tmp/allConcat.js']})
  .bundle()
  // stores in app file
  .pipe(source('app.js'))
  // the directory
  .pipe(gulp.dest('./build/js'));
})



// tool to analyzes code and warns about parts that don't
 // follow stylistic conventions, or could cause bugs in the future.
gulp.task('jshint', function(){
  return gulp.src(['js/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
// using del package to clean up the unnecessary code
// and to make sure that all our files are up-to-date
gulp.task("clean", function(){
  return del(['build', 'tmp']);
});

//runs clean and builds
gulp.task("build", ['clean'], function(){
  // specifying what we want to run based on whether
  // we are in development mode or deploying a production build.
  if (buildProduction) {
    gulp.start('minifyScripts');
  } else {
    gulp.start('jsBrowserify');
    gulp.start('serve');
  }
  //starts bower
  gulp.start('bower');
  gulp.start('cssBuild');
});
