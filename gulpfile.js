'use strict';

const path = require( 'path' );
const gulp = require( 'gulp' );
const sourcemaps = require( 'gulp-sourcemaps' );
const autoprefixer = require( 'gulp-autoprefixer' );
const concat = require( 'gulp-concat' );
const cleanCSS = require( 'gulp-clean-css' );
const order = require( 'gulp-order' );
const babel = require( 'gulp-babel' );
const htmlreplace = require( 'gulp-html-replace' );
const htmlmin = require( 'gulp-htmlmin' );

const publicFolder = path.join( __dirname, './public' );
const distFolder = path.join( __dirname, './public_dist' );

gulp.task( 'build-css', function() {
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

gulp.task( 'build-js', function() {
  gulp.src( path.join( __dirname, 'node_modules/es6-promise/dist/es6-promise.auto.min.*' ) )
    .pipe( gulp.dest( path.join( distFolder, 'js' ) ) );

  gulp.src( path.join( publicFolder, './js/**/*.js' ) )
    .pipe( order( [
        'lite.js',
        'lite-request.js',
        'view.js',
        'app.js'
      ]
    ) )
    .pipe( babel( {
      presets: [ 'es2015' ]
    } ) )
    .pipe( concat( 'app.js' ) )
    .pipe( gulp.dest( path.join( distFolder, 'js' ) ) );
} );

gulp.task( 'build', [ 'build-js', 'build-css' ], function() {
  gulp.src( path.join( publicFolder, './images/**/*' ) )
    .pipe( gulp.dest( path.join( distFolder, 'images' ) ) );

  let replaceOptions = {
    css: 'css/main.css',
    js: 'js/app.js',
    promise: 'js/es6-promise.auto.min.js',
  };

  if ( process.env.GA && process.env.GA.match( /^[\w]{2}-[\d]+(-[\d]+)?$/ ) ) {
    replaceOptions.ga = {
      src: null,
      tpl: `<script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
        ga('create', '${process.env.GA}', 'auto');
        ga('send', 'pageview');
      </script>`
    }
  }

  gulp.src( path.join( publicFolder, './index.html' ) )
    .pipe( htmlreplace( replaceOptions ) )
    .pipe( htmlmin( { collapseWhitespace: true } ) )
    .pipe( gulp.dest( distFolder ) );
} );