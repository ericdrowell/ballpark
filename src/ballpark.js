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

        // sizes
        arrayElementSize = 0,
        objectElementSize = 0,
        objectKeySize = 0,

        totalSize = 0;

    function addObject(a) {
      var keys = Object.keys(a),
          len = keys.length,
          key, n, a0Type;

      // only process if we have not yet analyzed this object
      if (!a.__ballpark) {
        objectCount++;

        if (len > 0) {
          a0Type = getType(a[keys[0]]);

          for (key in a) {
            addKey(key);
          }

          // NOTE: ballpark assumes that you (the developer) are using homogenous
          // objects because it's good JavaScript practice.
          if (a0Type === 'array') {
            for (key in a) {
              addArray(a[key]);
            }
          }
          else if (a0Type === 'object') {
            for (key in a) {
              addObject(a[key]);
            }
          }
          else {
            objectElementSize += 8 * len; 
          }
        }

        // add crumb so that we do not double count the same object by reference
        a.__ballpark = true;
      }
    }

    function addArray(a) {
      var len, n, a0Type;

      // only process if we have not yet analyzed this array
      if (!a.__ballpark) {
        len = a.length;
        arrayCount++;

        if (len > 0) {
          arrayElementCount += len;
          a0Type = getType(a[0]);

          // NOTE: ballpark assumes that you (the developer) are using homogenous
          // arrays because it's good JavaScript practice.
          if (a0Type === 'array') {
            for (n=0; n<len; n++) {
              addArray(a[n]);
            }
          }
          else if (a0Type === 'object') {
            for (n=0; n<len; n++) {
              addObject(a[n]);
            }
          }
          else {
            arrayElementSize += 8 * len; 
          }
        }

        // add crumb so that we do not double count the same object by reference
        a.__ballpark = true;
      }
    }

    function addKey(a) {
      objectKeyCount++;
      objectKeySize += a.length * 2.5;
    }

    function formatSize(size) {
      if (size > 1000000000) {
        return (Math.round(size * 10 / 1000000000) / 10) + ' GB';
      }
      else if (size > 1000000) {
        return (Math.round(size * 10 / 1000000) / 10) + ' MB';
      }
      else if (size > 1000) {
        return (Math.round(size * 10 / 1000) / 10) + ' KB';
      }
      else {
        return (Math.round(size * 10 / 1) / 10) + ' B';
      }
    }

    // start traversing
    if (getType(a) === 'object') {
      addObject(a);
    }
    else if (getType(a) === 'array') {
      addArray(a);
    }

    totalSize = Math.ceil(arrayElementSize + objectElementSize + objectKeySize);

    return {
      objectCount: objectCount,
      objectKeyCount: objectKeyCount,
      arrayCount: arrayCount,
      arrayElementCount: arrayElementCount,

      arrayElementSize: Math.ceil(arrayElementSize),
      objectElementSize: Math.ceil(objectElementSize),
      objectKeySize: Math.ceil(objectKeySize),
      size: totalSize,
      formattedSize: formatSize(totalSize)
    };
  };

  // export to window
  window.ballpark = ballpark;
})();