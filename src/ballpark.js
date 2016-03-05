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
        stringCount = 0,
        numberCount = 0,

        // sizes
        stringSize = 0,
        numberSize = 0,

        totalSize = 0;

    function addKeys(keys) {
      var len = keys.length;

      keys.forEach(function(key) {
        addThing(key);
      });

      objectKeyCount += len;
    }

    function addThing(val) {
      var type = getType(val);

      if (type === 'array') {
        addArray(val);
      }
      else if (type === 'object') {
        addObject(val);
      }
      else if (type === 'string') {
        stringCount++;
        // string characters take up 2 bytes via UTF-16
        stringSize += 2 * val.length;
      }
      else if (type === 'number') {
        numberCount++;
        
        // if int
        // integers take up between 1 and 4 bytes
        if (val % 1 === 0) {
          numberSize += 4;
        }
        // if float
        // floats take up between 4 and 8 bytes
        else {
          numberSize += 8;
        }
      }
    }

    function addObject(obj) {
      var keys, len, key, n, type, val;

      // only process if we have not yet analyzed this object
      if (obj && !obj.__ballpark) {
        keys = Object.keys(obj);
        len = keys.length;
        objectCount++;

        addKeys(keys);

        if (len > 0) {
          for (key in obj) {
            addThing(obj[key]);
          }
        }

        // add crumb so that we do not double count the same object by reference
        obj.__ballpark = true;
      }
    }

    function addArray(arr) {
      var len, n, type, val;

      // only process if we have not yet analyzed this array
      if (arr && !arr.__ballpark) {
        len = arr.length;
        arrayCount++;

        if (len > 0) {
          arrayElementCount += len;

          for (n=0; n<len; n++) {
            addThing(arr[n]);
          }
        }

        // add crumb so that we do not double count the same object by reference
        arr.__ballpark = true;
      }
    }

    function formatSize(size) {
      if (size >= 1000000000) {
        return (Math.round(size * 10 / 1000000000) / 10) + ' GB';
      }
      else if (size >= 1000000) {
        return (Math.round(size * 10 / 1000000) / 10) + ' MB';
      }
      else if (size >= 1000) {
        return (Math.round(size * 10 / 1000) / 10) + ' KB';
      }
      else {
        return (Math.round(size * 10 / 1) / 10) + ' B';
      }
    }

    // start traversing
    addThing(a);

    totalSize = Math.ceil(stringSize + numberSize);

    return {
      // counts
      objectCount: objectCount,
      objectKeyCount: objectKeyCount,
      arrayCount: arrayCount,
      arrayElementCount: arrayElementCount,
      stringCount: stringCount,
      numberCount: numberCount,

      // sizes
      stringSize: Math.ceil(stringSize),
      numberSize: Math.ceil(numberSize),

      size: totalSize,
      formattedSize: formatSize(totalSize)
    };
  };

  // export to window
  window.ballpark = ballpark;
})();