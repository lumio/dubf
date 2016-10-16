'use strict';

const path = require( 'path' );
const config = require( path.join( __dirname, 'config.js' ) );
const movieDB = require( 'moviedb' )( config.moviedbKey );

const Random = require( 'random-js' );
const random = new Random( Random.engines.mt19937().autoSeed() );

module.exports = function( server ) {

  let movieConfig = false;

  function getRandomPage() {
    return random.integer( 1, 20 );
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

  function getRandomItemWithPoster( results, mdbConfig, retries = 10 ) {
    let randomResult = random.integer( 0, results.length - 1 );
    let item = results[ randomResult ];

    if ( !item.poster_path && retries ) {
      return getRandomItemWithPoster( results, mdbConfig, retries - 1 );
    }
    else if ( item.poster_path ) {
      item.poster = mdbConfig.images.base_url + 'w780' + item.poster_path;
      if ( !item.title && item.name ) {
        item.title = item.name;
      }

      let searchTokens = [ item.title ];
      if ( item.release_date && item.release_date.match( /^([\d]{4})/ ) ) {
        let match = item.release_date.match( /^([\d]{4})/ );
        searchTokens.push( match[ 1 ] );
      }
      item.url = 'https://www.youtube.com/results?search_query=' +
        encodeURIComponent( searchTokens.join( ' ' ) + ' trailer' );
      return item;
    }

    return false;
  }

  function requestResponse( item, type, mdbConfig, request, reply, retries ) {
    if ( !item ) {
      return responseWithRandomItem( type, mdbConfig, request, reply, retries - 1 );
    }
    return reply( item );
  }

  function responseWithRandomItem( type, mdbConfig, request, reply, retries = 10 ) {
    let page = getRandomPage();
    movieDB[ type ]( {
      page,
      sort_by: 'popularity.desc'
    }, function( err, res ) {
      if ( !res || !res.results && roundsUntilDead ) {
        setTimeout( function() {
          responseWithRandomItem( type, mdbConfig, request, reply, retries - 1 );
        }, 500 );
      }
      else if ( res && res.results ) {
        let item = getRandomItemWithPoster( res.results, mdbConfig );
        requestResponse( item, type, mdbConfig, request, reply, retries );
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