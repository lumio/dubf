'use strict';

const path = require( 'path' );
const gulp = require( 'gulp' );
const sourcemaps = require( 'gulp-sourcemaps' );
const autoprefixer = require( 'gulp-autoprefixer' );
const concat = require( 'gulp-concat' );
const cleanCSS = require( 'gulp-clean-css' );

gulp.task( 'build-css', function () {
  gulp.src( path.join( __dirname, './public/css' ) + '/**/*.css' )
    .pipe( sourcemaps.init() )
    .pipe( autoprefixer( {
      browsers: [ 'last 2 versions' ],
      cascade: false,
    } ) )
    .pipe( concat( 'main.css' ) )
    .pipe( cleanCSS() )
    .pipe( sourcemaps.write( '.' ) )
    .pipe( gulp.dest( 'public_dist/css' ) );
} );

gulp.task( 'build', [ 'build-css' ], function () {
  gulp.src( path.join( __dirname, './public/images/**/*' ) )
    .pipe( gulp.dest( 'public_dist/images' ) );
} );