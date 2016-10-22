'use strict';

const path = require( 'path' );

(function () {
  let _config = {};
  let config = {};
  let envConfig = {};
  let configJSMissing = false;

  try {
    config = require( path.join( __dirname, '../config.js' ) );
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

  module.exports = _config;
})();