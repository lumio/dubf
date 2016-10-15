(function( $, $v ) {

  function receiveItem( type ) {
    $v.showLoadingIndicator();

    let url = `/api/dubf/${type}`;
    $.get( url ).then( function( data ) {
      window.lview( data );
    } );
  }

  function selectType( event ) {
    event.preventDefault();
    let type = event.target.getAttribute( 'href' );

    switch ( type ) {
      case '#movie':
        return receiveItem( 'movie' );
      case '#tvshow':
        return receiveItem( 'tvshow' );
    }
  }

  $( 'SelectTypeMovie' ).elm().addEventListener( 'click', selectType );
  $( 'SelectTypeTVShow' ).elm().addEventListener( 'click', selectType );

})( window.lsel, window.lview );