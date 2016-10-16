'use strict';

const path = require( 'path' );
const hapi = require( 'hapi' );
const config = require( path.join( __dirname, 'config.js' ) );

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

  require( path.join( __dirname, 'moviedb.js' ) )( server );

  server.start( ( err ) => {

    if ( err ) {
      throw err;
    }

    console.log( 'Server running at ', server.info.uri );

  } )
} );