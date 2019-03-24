const ejs = require('gulp-ejs')
const gulp = require('gulp')
const fs = require('fs')
const plumber = require('gulp-plumber')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const sassGlob = require('gulp-sass-glob')
const browserSync = require('browser-sync')

gulp.task('ejs', () => {
  const json = JSON.parse(fs.readFileSync('resource.json'))
  return gulp
    .src('views/*.ejs')
    .pipe(ejs(json))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest('_build'))
})

gulp.task('sass', () => {
  return gulp
    .src('assets/stylesheets/style.sass')
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(gulp.dest('_build'))
})

gulp.task('copy', () => {
  return gulp
    .src(['assets/images/*', 'assets/scripts/*'], { base: 'assets' })
    .pipe(gulp.dest('_build'))
})

gulp.task('browser-sync', () => {
  return browserSync({
    server: {
      baseDir: '_build',
      index: 'index.html'
    }
  })
})

gulp.task('bs-reload', () => {
  browserSync.reload()
  done()
})

gulp.task('default', gulp.parallel('ejs', 'sass', 'copy'))

gulp.task(
  'watch',
  gulp.parallel('browser-sync', () => {
    gulp.watch(
      ['views/*.ejs', 'views/**/*.ejs', 'resource.json'],
      gulp.task('ejs')
    )
    gulp.watch(
      ['assets/stylesheets/*', 'assets/stylesheets/**/*'],
      gulp.task('sass')
    )
    gulp.watch(
      [
        'assets/images/*, assets/images/**/*',
        'assets/scripts/*',
        'assets/scripts/**/*'
      ],
      gulp.task('copy')
    )
    gulp.watch(['_build/*', '_build/**/*'], gulp.task('bs-reload'))
  })
)
