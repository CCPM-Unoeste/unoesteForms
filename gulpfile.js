const gulp = require('gulp');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');

exports.default = () => {
    gulp.watch('src/assets/style/scss/*.scss', () => {
        return gulp.src('src/assets/style/scss/*.scss')
            .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
            .pipe(gulp.dest('src/assets/style/css/'));
    })
}