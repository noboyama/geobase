var gulp = require('gulp'); // gulpを読み込む
var typescript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');

var srcLib =["./typescript/lib/*.ts" ] ;
var srcClient =["./typescript/client/*.ts" ] ;
var srcServer =["./typescript/server/*.ts" ] ;

gulp.task("lib" , function() {
  gulp.src( srcLib )
	.pipe( sourcemaps.init() )
    .pipe(typescript())
	.js
	.pipe( sourcemaps.write() )
    .pipe(gulp.dest("./public/js/"));
});

gulp.task("client" , function() {
  gulp.src( srcClient )
	.pipe( sourcemaps.init() )
    .pipe(typescript())
	.js
	.pipe( sourcemaps.write() )
    .pipe(gulp.dest("./public/js/"));
});

gulp.task("server" , function() {
  gulp.src( srcServer )
	.pipe( sourcemaps.init() )
    .pipe(typescript())
	.js
	.pipe( sourcemaps.write() )
    .pipe(gulp.dest("./routes/"));
});


gulp.task('watch', function (callback) {
	gulp.watch(srcLib , ["lib"]) ;
	gulp.watch(srcClient , ["client"]) ;
	gulp.watch(srcServer , ["server"]) ;
});

gulp.task('default', ['watch']);