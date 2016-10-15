(function( $ ) {
  let loadingIndicator = $( 'LoadingIndicator' );

  function receiveItem( type ) {
    loadingIndicator.addClass( 'visible' );

    let url = `/api/dubf/${type}`;
    $.get( url ).then( function( data ) {
      console.log( data );
      loadingIndicator.removeClass( 'visible' );
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

})( window.lsel );