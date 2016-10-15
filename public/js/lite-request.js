(function( $ ) {
  $.request = function( options ) {

    return new Promise( ( resolve, reject ) => {
      let _options = Object.assign( {
        method: '',
        url: '',
        data: null,
      }, options );
      console.log( _options );

      let xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if ( xhr.readyState === 4 ) {
          if ( xhr.status === 200 ) {
            resolve( xhr.responseText );
          }
          else {
            reject( xhr.status, xhr );
          }
        }
      };
      xhr.open( _options.method, _options.url );
      xhr.send( _options.data );
    } );

  };

  $.get = function( url ) {
    return $.request( {
      method: 'GET',
      url
    } ).then( ( data ) => {
      try {
        return JSON.parse( data );
      } catch ( e ) {
        return data;
      }
    } );
  }
})( window.lsel );