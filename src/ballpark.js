(function() {
  // utility for getting type
  var getType = function(a) {
    var toString,
        typeOf = typeof a;

    // objects
    if (typeOf === 'object') {
      toString = Object.prototype.toString.call(a);

      if (toString === '[object Object]') {
        return 'object';
      }
      else if (toString === '[object Array]') {
        return 'array';
      }
      else if (toString === '[object Null]') {
        return 'null';
      }
    }
    // primitives
    else {
      return typeOf;
    }
  };

  var ballpark = function(a) {      
    var objectCount = 0,
        objectKeyCount = 0,
        arrayCount = 0,
        arrayElementCount = 0,
        numberCount = 0,
        stringCount = 0,
        booleanCount = 0,
        nullCount = 0,

        // sizes
        booleanSize = 0,
        numberSize = 0,
        stringSize = 0,
        objectKeySize = 0,
        nullSize = 0;

    function route(a) {
      // NOTE: ignoring functions
      switch(getType(a)) {
        case 'object': ballparkObject(a); break;
        case 'array': ballparkArray(a); break;
        case 'number': ballparkNumber(a); break;
        case 'string': ballparkString(a); break;
        case 'boolean': ballparkBoolean(a); break;
        case 'null': ballparkNull(a); break;
      }
    }

    function ballparkObject(a) {
      var key;

      // only process if we have not yet analyzed this object
      if (!a.__ballpark) {
        objectCount++;

        for (key in a) {
          if (a.hasOwnProperty(key)) {
            objectKeyCount++;
            objectKeySize += 2 * key.length;
            // add crumb so that we do not double count the same object by reference
            a.__ballpark = true;
            route(a[key]);
          }
        }
      }
    }

    function ballparkArray(a) {
      var len, n;

      // only process if we have not yet analyzed this array
      if (!a.__ballpark) {
        len = a.length;
        arrayCount++;

        for (n=0; n<len; n++) {
          arrayElementCount++;
          // add crumb so that we do not double count the same array by reference
          a.__ballpark = true;
          route(a[n]);
        }
      }
    }

    function ballparkNumber() {
      numberCount++;
      numberSize += 8;
    }

    function ballparkString(a) {
      stringCount++;
      stringSize += 2 * a.length;
    }

    function ballparkBoolean() {
      booleanCount++;
      booleanSize += 4 ;
    }

    function ballparkNull() {
      nullCount++;
      nullSize += 4;
    }

    // start traversing
    route(a);

    return {
      objectCount: objectCount,
      objectKeyCount: objectKeyCount,
      arrayCount: arrayCount,
      arrayElementCount: arrayElementCount,
      numberCount: numberCount,
      stringCount: stringCount,
      booleanCount: booleanCount,
      nullCount: nullCount,

      booleanSize: booleanSize,
      numberSize: numberSize,
      stringSize: stringSize,
      objectKeySize: objectKeySize,
      nullSize: nullSize,
      size: booleanSize + numberSize + stringSize + objectKeySize + nullSize
    };
  };

  // export to window
  window.ballpark = ballpark;
})();