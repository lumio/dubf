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
        let findToken = new RegExp( escapeInput( className ) + '[\s]*', 'g' );
        element.className = element.className.replace( findToken, '' ).trim();
        return this;
      },

      show() {
        this.addClass( 'visible' );
      },

      hide() {
        this.removeClass( 'visible' );
      },

      blur() {
        element.blur();
        return this;
      },

      focus() {
        element.focus();
        return this;
      },

      listener( eventName, callback ) {
        element.addEventListener( eventName, callback );
        return this;
      },

      attr( attributeName, value ) {
        if ( typeof value === 'undefined' ) {
          return element.getAttribute( attributeName );
        }

        element.setAttribute( attributeName, value );
        return this;
      },

      text( value ) {
        if ( typeof value === 'undefined' ) {
          return element.textContent;
        }

        element.textContent = value;
        return this;
      },

      clear() {
        element.innerHTML = '';
        return this;
      },

      elm() {
        return element;
      },

      append( node ) {
        let elm = node;
        if ( typeof node.elm === 'function' ) {
          elm = node.elm();
        }

        element.appendChild( elm );
        return this;
      }

    };

  };

  obj.create = function( type ) {
    let elm = document.createElement( type );
    return window.lsel( elm );
  };

  obj.assign = function( ...args ) {
    if ( typeof Object.assign !== 'undefined' ) {
      return Object.assign.apply( null, args );
    }

    let result = {};
    for ( let i in args ) {
      for ( let key in args[ i ] ) {
        if ( !args[ i ].hasOwnProperty( key ) ) {
          continue;
        }

        result[ key ] = args[ i ][ key ];
      }
    }
    return result;
  };

  return obj;

})();

let $ = window.lsel;