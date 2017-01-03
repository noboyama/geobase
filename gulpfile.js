var gulp = require('gulp'); // gulpを読み込む
var typescript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');

var srcServer =["./**/*.ts" , "!./node_modules/**/*.ts" ] ;
/*
gulp.task("client" , function() {
  gulp.src( srcClient )
	.pipe( sourcemaps.init() )
    .pipe(typescript())
	.js
	.pipe( sourcemaps.write() )
    .pipe(gulp.dest("./public/js/"));
});
*/

gulp.task("server" , function() {
  gulp.src( srcServer  )
	.pipe( sourcemaps.init() )
    .pipe(typescript())
	.js
	.pipe( sourcemaps.write() )
    .pipe(gulp.dest("./"));
});


gulp.task('watch', function (callback) {
	//gulp.watch("srcClient" , ["client"]) ;
	gulp.watch( srcServer  , ["server"]) ;
});

gulp.task('default', ['watch']);