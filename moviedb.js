'use strict';

const path = require( 'path' );
const config = require( path.join( __dirname, 'config.js' ) );
const movieDB = require( 'moviedb' )( config.moviedbKey );

const Random = require( 'random-js' );
const random = new Random( Random.engines.mt19937().autoSeed() );

module.exports = function( server ) {

  let pages = {};
  let movieConfig = false;

  function getRandomPage( availablePages ) {
    if ( !availablePages ) {
      return random.integer( 1, 10 );
    }

    return random.integer( 1, availablePages );
  }

  function getConfiguration() {
    return new Promise( ( resolve, reject ) => {
      if ( !movieConfig ) {
        movieDB.configuration( {}, function( err, res ) {
          if ( err ) {
            reject( err );
          }

          movieConfig = res;
          resolve( movieConfig );
        } );
      }
      else {
        resolve( movieConfig );
      }
    } );
  }

  function requestResponse( results, mdbConfig, reply ) {
    let randomResult = random.integer( 0, results.length - 1 );
    let item = results[ randomResult ];
    item.poster = mdbConfig.images.base_url + 'w780' + item.poster_path;

    return reply( item );
  }

  function responseWithRandomItem( type, mdbConfig, request, reply, roundsUntilDead = 10 ) {
    let page = getRandomPage( pages[ type ] );
    movieDB[ type ]( { page }, function( err, res ) {
      if ( res && res.total_pages ) {
        pages[ type ] = Math.round( res.total_pages * .1 );
      }

      if ( !res || !res.results && roundsUntilDead ) {
        setTimeout( function() {
          responseWithRandomItem( type, mdbConfig, request, reply, roundsUntilDead - 1 );
        }, 500 );
      }
      else if ( res && res.results ) {
        requestResponse( res.results, mdbConfig, reply );
      }
      else {
        reply( { error: 'No movie found', mdbError: err } );
      }
    } );
  }

  server.route( {
    method: 'GET',
    path: '/api/dubf/movie',
    handler: function( request, reply ) {
      getConfiguration().then( ( mdbConfig ) => {
        responseWithRandomItem( 'discoverMovie', mdbConfig, request, reply );
      } );
    }
  } );

  server.route( {
    method: 'GET',
    path: '/api/dubf/tvshow',
    handler: function( request, reply ) {
      getConfiguration().then( ( mdbConfig ) => {
        responseWithRandomItem( 'discoverTv', mdbConfig, request, reply );
      } );
    }
  } );
};