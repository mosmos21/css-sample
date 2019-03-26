const fs = require('fs')
const gulp = require('gulp')
const plumber = require('gulp-plumber')
const rename = require('gulp-rename')
const ejs = require('gulp-ejs')
const htmlmin = require('gulp-htmlmin')
const sass = require('gulp-sass')
const sassGlob = require('gulp-sass-glob')
const cleanCss = require('gulp-clean-css')
const browserSync = require('browser-sync')
const cache = require('gulp-cache')
const createResource = require('./lib/create_resource')

gulp.task('create-resource', done => {
  createResource({
    baseFile: 'assets/json/base.json',
    componentDir: 'assets/stylesheets/components/',
    exportFile: 'resource.json'
  })
  done()
})

gulp.task('ejs', () => {
  const json = JSON.parse(fs.readFileSync('resource.json'))
  return gulp
    .src('views/*.ejs')
    .pipe(ejs(json))
    .pipe(
      htmlmin({
        collapseWhitespace: true
      })
    )
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest('_build'))
    .pipe(browserSync.stream())
})

gulp.task('sass', () => {
  return gulp
    .src('assets/stylesheets/style.sass')
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(cleanCss())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('_build'))
    .pipe(browserSync.stream())
})

gulp.task('copy', () => {
  return gulp
    .src(['assets/images/**/*', 'assets/scripts/**/*'], { base: 'assets' })
    .pipe(gulp.dest('_build'))
    .pipe(browserSync.stream())
})

gulp.task('browser-sync', () => {
  return browserSync({
    server: {
      baseDir: '_build',
      index: 'index.html'
    }
  })
})

gulp.task('default', gulp.parallel('ejs', 'sass', 'copy'))

gulp.task(
  'watch',
  gulp.series(
    'default',
    gulp.parallel('browser-sync', () => {
      gulp.watch(['views/**/*.ejs', 'resource.json'], gulp.task('ejs'))
      gulp.watch(['assets/stylesheets/**/*'], gulp.task('sass'))
      gulp.watch(
        ['assets/images/**/*', 'assets/scripts/**/*'],
        gulp.task('copy')
      )
    })
  )
)
