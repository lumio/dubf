window.lsel = (function() {

  const specialChars = [ '-', '[', ']', '/', '{', '}', '(', ')', '*', '+', '?', '.', '\\', '^', '$', '|' ];
  const escapeRegex = new RegExp( `[${specialChars.join( '\\' )}]`, 'g' );

  function escapeInput( input ) {
    return input.replace( escapeRegex, '\\$&' );
  }

  return function( element ) {
    let _element = element;

    if ( typeof element === 'string' ) {
      element = document.getElementById( element );
    }

    if ( !element ) {
      throw new Error( 'Element (`' + _element + '`) is not a DOM object or not a valid ID' );
    }

    return {

      addClass( className ) {
        element.className = `${element.className} ${className}`.trim();
        return this;
      },

      removeClass( className ) {
        let findToken = new RegExp( escapeInput( className ), 'g' );
        element.className = element.className.replace( findToken, '' ).trim();
        return this;
      }

    }

  }

})();

let $ = window.lsel;