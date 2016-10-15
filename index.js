'use strict';

const path = require( 'path' );
const hapi = require( 'hapi' );

const server = new hapi.Server( {

  connections: {
    routes: {
      files: {
        relativeTo: path.join( __dirname, 'public' )
      }
    }
  }

} );

server.connection( {

  host: 'localhost',
  port: 8080,

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