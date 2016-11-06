'use strict';

const path = require( 'path' );
const config = require( path.join( __dirname, 'config' ) );
const movieDB = require( 'moviedb' )( config.moviedbKey );

const Random = require( 'random-js' );
const random = new Random( Random.engines.mt19937().autoSeed() );
const cache = require( 'memory-cache' );

const cacheValidTime = 60000;
const configCacheValidTime = 10000000;

module.exports = {

  getRandomPage: function( type ) {
    let page = random.integer( 1, 20 );
    let cacheKey = `page.${type}.${page}`;

    return new Promise( ( resolve, reject ) => {
      let cachedPage = cache.get( cacheKey );

      if ( cachedPage ) {
        console.log( `HIT ${cacheKey}` );
        return resolve( cachedPage );
      }
      movieDB[ type ]( {
        page,
        sort_by: 'popularity.desc'
      }, function( err, res ) {
        if ( err ) return reject( err );

        console.log( `MISS ${cacheKey}` );
        cache.put( cacheKey, res, cacheValidTime );
        return resolve( res );
      } );
    } );
  },

  getConfiguration: function() {
    let movieConfig;

    return new Promise( ( resolve, reject ) => {
      movieConfig = cache.get( 'movieConfig' );
      if ( !movieConfig ) {
        movieDB.configuration( {}, function( err, res ) {
          if ( err ) {
            reject( err );
          }

          movieConfig = res;
          cache.put( 'movieConfig', movieConfig, configCacheValidTime );
          resolve( movieConfig );
        } );
      }
      else {
        resolve( movieConfig );
      }
    } );
  },

  getRandomItemWithPoster: function( results, mdbConfig, retries = 10 ) {
    let randomResult = random.integer( 0, results.length - 1 );
    let item = results[ randomResult ];

    if ( !item.poster_path && retries ) {
      return this.getRandomItemWithPoster( results, mdbConfig, retries - 1 );
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
  },

  requestResponse: function( item, type, mdbConfig, request, reply, retries ) {
    if ( !item ) {
      return this.responseWithRandomItem( type, mdbConfig, request, reply, retries - 1 );
    }
    return reply( item );
  },

  responseWithRandomItem: function( type, mdbConfig, request, reply, retries = 10 ) {
    let currentYear = ( new Date() ).getFullYear();

    this.getRandomPage( type ).then( ( res ) => {
      let retry = false;

      let hasResults = res && res.results;
      if ( !hasResults ) {
        retry = true;
      }
      else {
        let item = this.getRandomItemWithPoster( res.results, mdbConfig );
        let itemNotReleasedYet = type == 'movie' &&
          ( !item.release_date || parseInt( item.release_date.substr( 0, 4 ) ) > currentYear );
        if ( itemNotReleasedYet ) {
          retry = true;
        }
        else {
          return this.requestResponse( item, type, mdbConfig, request, reply, retries );
        }
      }

      if ( retry && retries ) {
        setTimeout( () => {
          this.responseWithRandomItem( type, mdbConfig, request, reply, retries - 1 );
        }, 500 );
      }
      else {
        reply( { error: 'No movie found', mdbError: err } );
      }
    } );
  },

  init: function( server ) {
    server.route( {
      method: 'GET',
      path: '/api/dubf/movie',
      handler: ( request, reply ) => {
        this.getConfiguration().then( ( mdbConfig ) => {
          this.responseWithRandomItem( 'discoverMovie', mdbConfig, request, reply );
        } );
      }
    } );

    server.route( {
      method: 'GET',
      path: '/api/dubf/tvshow',
      handler: ( request, reply ) => {
        this.getConfiguration().then( ( mdbConfig ) => {
          this.responseWithRandomItem( 'discoverTv', mdbConfig, request, reply );
        } );
      }
    } );
  }
};