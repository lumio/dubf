'use strict';

require( 'assert' );
const path = require( 'path' );
const moviedb = require( path.join( __dirname, 'moviedb' ) );

describe( 'MovieDB', function() {

  it( 'should init', function() {
    moviedb.init( {
      route: function() {
      }
    } );
  } );

} );