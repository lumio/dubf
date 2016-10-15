(function( $, $v ) {

  let lastType = '';

  function receiveItem( type ) {
    lastType = type;
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
  $( 'Restart' ).elm().addEventListener( 'click', function( event ) {
    window.lview.reset( false );
    $( event.target ).focus();
    receiveItem( lastType );
    setTimeout( function() {
      $( event.target ).blur();
    }, 1000 )
  } );
  $( 'Reset' ).elm().addEventListener( 'click', function() {
    window.lview.reset();
  } )

})( window.lsel, window.lview );