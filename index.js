'use strict';

const colors = require( 'colors' );
const path = require( 'path' );
const hapi = require( 'hapi' );

console.log( 'DEBUG ' + __dirname );
console.log( 'DEBUG ', JSON.stringify( process.env, null, 2 ) );

function getConfig() {
  let _config = {};
  let config = {};
  let envConfig = {};
  let configJSMissing = false;

  try {
    config = require( path.join( __dirname, 'config.js' ) );
  } catch ( e ) {
    configJSMissing = true;
  }

  if ( process.env.PORT )
    envConfig.port = process.env.PORT;
  if ( process.env.HOST )
    envConfig.host = process.env.HOST;
  if ( process.env.APIKEY )
    envConfig.moviedbKey = process.env.APIKEY;

  _config = Object.assign( _config, config, envConfig );

  if ( !_config.port || !_config.host || !_config.moviedbKey ) {
    console.error( '\nWHOUPS!'.yellow );
    console.error( '  |'.yellow );
    console.error( '  v\n'.yellow );

    if ( configJSMissing ) {
      console.error( 'It seams that you have no config.js. Duplicate config.example.js and name it config.js to get started.' );
      console.error( 'In order to get this project working, you need to register on <http://themoviedb.org> and get yourself an API v3 key' );
    }
    else {
      console.error( 'One or more options are not set. See config.example.js on how to set up your own config.js.' );
    }

    process.exit( 1 );
  }

  return _config;
}

let config = getConfig();

// let staticDirectory = 'public_dist';
// if ( process.env.DEVELOPMENT ) {
//   staticDirectory = 'public';
// }
let staticDirectory = 'public';

const server = new hapi.Server( {

  connections: {
    routes: {
      files: {
        relativeTo: path.join( __dirname, staticDirectory )
      }
    }
  }

} );

server.connection( {

  host: config.host,
  port: config.port,

} );

server.register( require( 'inert' ), ( err ) => {

  if ( err ) {
    throw err;
  }

  server.route( {

    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: '.',
        redirectToSlash: true,
        index: true
      }
    }

  } );

  require( path.join( __dirname, 'moviedb.js' ) )( server );

  server.start( ( err ) => {

    if ( err ) {
      switch ( err.errno ) {
        case 'EADDRINUSE':
          console.error( '\nWHOUPS!'.yellow );
          console.error( '  |'.yellow );
          console.error( '  v\n'.yellow );
          console.error( `It seams that the port ${server.info.port} is already in use.\nChange the port number in your config.js and try again.` );
          break;
        default:
          throw err;
      }

      process.exit( 1 );
    }

    console.log( 'Server running at ', server.info.uri.green );

  } )
} );