'use strict';

const colors = require( 'colors' );
const path = require( 'path' );
const hapi = require( 'hapi' );

const config = require( path.join( __dirname, 'lib/config' ) );

let staticDirectory = 'public_dist';
if ( process.env.DEVELOPMENT ) {
  staticDirectory = 'public';
}

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

  require( path.join( __dirname, 'lib/moviedb' ) )( server );

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