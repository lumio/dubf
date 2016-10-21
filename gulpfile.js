'use strict';

const path = require( 'path' );
const gulp = require( 'gulp' );
const sourcemaps = require( 'gulp-sourcemaps' );
const autoprefixer = require( 'gulp-autoprefixer' );
const concat = require( 'gulp-concat' );
const cleanCSS = require( 'gulp-clean-css' );
const order = require( 'gulp-order' );
const htmlreplace = require( 'gulp-html-replace' );

const publicFolder = path.join( __dirname, './public' );
const distFolder = path.join( __dirname, './public_dist' );

gulp.task( 'build-css', function () {
  gulp.src( path.join( publicFolder, './css/**/*.css' ) )
    .pipe( sourcemaps.init() )
    .pipe( autoprefixer( {
      browsers: [ 'last 2 versions' ],
      cascade: false,
    } ) )
    .pipe( concat( 'main.css' ) )
    .pipe( cleanCSS() )
    .pipe( sourcemaps.write( '.' ) )
    .pipe( gulp.dest( path.join( distFolder, 'css' ) ) );
} );

gulp.task( 'build-js', function () {
  gulp.src( path.join( publicFolder, './js/**/*.js' ) )
    .pipe( order( [
        'lite.js',
        'lite-request.js',
        'view.js',
        'app.js'
      ]
    ) )
    .pipe( concat( 'app.js' ) )
    .pipe( gulp.dest( path.join( distFolder, 'js' ) ) );
} );

gulp.task( 'build', [ 'build-js', 'build-css' ], function () {
  gulp.src( path.join( publicFolder, './images/**/*' ) )
    .pipe( gulp.dest( path.join( distFolder, 'images' ) ) );

  gulp.src( path.join( publicFolder, './index.html' ) )
    .pipe( htmlreplace( {
      css: 'css/main.css',
      js: 'js/app.js'
    } ) )
    .pipe( gulp.dest( distFolder ) );
} );