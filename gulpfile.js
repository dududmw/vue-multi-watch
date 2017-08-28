const gulp=require('gulp');
const babel=require('gulp-babel');
const rimraf=require('rimraf');

gulp.task('del',function(cb){
    rimraf('./dist',cb);
})
gulp.task('babel',['del'],function(){
    return gulp.src('src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('dist'))
});
gulp.task('build',['babel'],function(){
});
gulp.task('watch',['build'],function(){
    gulp.watch('src/**/*',['build']);
});