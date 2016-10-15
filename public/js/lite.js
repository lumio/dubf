window.lsel = (function() {

  const specialChars = [ '-', '[', ']', '/', '{', '}', '(', ')', '*', '+', '?', '.', '\\', '^', '$', '|' ];
  const escapeRegex = new RegExp( `[${specialChars.join( '\\' )}]`, 'g' );

  function escapeInput( input ) {
    return input.replace( escapeRegex, '\\$&' );
  }

  let obj = function( element ) {
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
      },

      show() {
        this.addClass( 'visible' );
      },

      hide() {
        this.removeClass( 'visible' );
      },

      clear() {
        element.innerHeight = '';
      },

      elm() {
        return element;
      }

    };

  };

  obj.create = function( type ) {
    return document.createElement( type );
  };

  return obj;

})();

let $ = window.lsel;