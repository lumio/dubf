window.lview = (function( $ ) {
  let loadingIndicatorElm = $( 'LoadingIndicator' );
  let selectTypeElm = $( 'SelectType' );
  let resultElm = $( 'Result' );
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
    resultElm.clear();

    function showResult() {
      selectTypeElm.hide();
      resultElm.show();
      resultButtonsElm.show();
      hideLoadingIndicator();
    }

    let elements = {
      link: $.create( 'a' ),
      title: $.create( 'h1' ),
      image: $.create( 'img' ),
    };

    elements.title.text( data.title );
    elements.image
      .listener( 'load', showResult )
      .attr( 'src', data.poster )
      .addClass( 'Result-poster');

    elements.link
      .attr( 'href', data.url )
      .attr( 'target', '_blank' )
      .append( elements.title )
      .append( elements.image );

    resultElm.append( elements.link );
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