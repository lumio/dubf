window.lview = (function( $ ) {
  let loadingIndicatorElm = $( 'LoadingIndicator' );
  let selectTypeElm = $( 'SelectType' );
  let resultElm = $( 'Result' );

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
      hideLoadingIndicator();
    }

    let elements = {
      link: $.create( 'a' ),
      title: $.create( 'h1' ),
      image: $.create( 'img' ),
    };

    console.log( data );
    elements.title.textContent = data.title;
    elements.image.addEventListener( 'load', showResult );
    elements.image.setAttribute( 'src', data.poster );

    elements.link.setAttribute( 'href', data.url );
    elements.link.setAttribute( 'target', '_blank' );
    elements.link.appendChild( elements.title );
    elements.link.appendChild( elements.image );
    resultElm.elm().appendChild( elements.link );
  };

  obj.showLoadingIndicator = showLoadingIndicator;
  obj.hideLoadingIndicator = hideLoadingIndicator;

  return obj;
})( window.lsel );