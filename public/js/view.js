window.lview = (function( $ ) {
  let loadingIndicatorElm = $( 'LoadingIndicator' );
  let selectTypeElm = $( 'SelectType' );
  let resultElm = $( 'Result' );
  let resultInnerElm = $( 'ResultInner' );
  let resultButtonsElm = $( 'ResultButtons' );

  function showLoadingIndicator() {
    loadingIndicatorElm.show();
  }

  function hideLoadingIndicator() {
    loadingIndicatorElm.hide();
  }

  let obj = function( data ) {
    obj.view( data );
  };

  obj.view = function( data ) {
    resultInnerElm.clear();

    function showResult() {
      selectTypeElm.hide();
      resultElm.show();
      resultButtonsElm.show();
      hideLoadingIndicator();
    }

    let elements = {
      link: $.create( 'a' ),
      image: $.create( 'img' ),
    };

    let preloader = new Image();
    preloader.addEventListener( 'load', showResult );
    preloader.addEventListener( 'error', showResult );
    preloader.src = data.poster;

    elements.image
      .attr( 'src', data.poster )
      .addClass( 'Result-poster');

    elements.link
      .attr( 'href', data.url )
      .attr( 'target', '_blank' )
      .append( elements.image );

    resultInnerElm.append( elements.link );
  };

  obj.reset = function( showSelectBox = true ) {
    if ( showSelectBox ) {
      selectTypeElm.show();
    }
    resultElm.addClass( 'hide-transition' );
    resultButtonsElm.hide();
    hideLoadingIndicator();

    setTimeout( function() {
      resultElm.hide();
      resultElm.removeClass( 'hide-transition' );
    }, 500 );
  };

  obj.showLoadingIndicator = showLoadingIndicator;
  obj.hideLoadingIndicator = hideLoadingIndicator;

  return obj;
})( window.lsel );