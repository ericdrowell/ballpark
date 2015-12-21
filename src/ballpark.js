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

    function addKeys(keys) {
      var len = keys.length,
          longestKeyLength = 0,
          n;

      for (n=0; n<len; n++) {
        longestKeyLength = Math.max(longestKeyLength, keys[n].length);
      }

      //console.log(longestKeyLength)

      // this logic was reverse engineered by obtaining data points which related key 
      // lengths and memory usage, plotting them into a scatter plot, and solving the 
      // trendlines.  Generally, memory usage seems to increase linearly as a function 
      // of key length
      if (longestKeyLength <= 16) {
        objectKeySize += 2 * len;
      }
      else {
        objectKeySize += (9000000 + 99126 * longestKeyLength) * len / 100000;
      }
    }

    function addObject(a) {
      var keys, len, key, n, type;

      // only process if we have not yet analyzed this object
      if (a && !a.__ballpark) {
        keys = Object.keys(a);
        len = keys.length;
        objectCount++;

        addKeys(keys);

        if (len > 0) {
          for (key in a) {
            type = getType(a[key]);

            if (type === 'array') {
              addArray(a[key]);
            }
            else if (type === 'object') {
              for (key in a) {
                addObject(a[key]);
              }
            }
            else {
              objectElementSize += 8; 
            }
          }
        }

        // add crumb so that we do not double count the same object by reference
        a.__ballpark = true;
      }
    }

    function addArray(a) {
      var len, n, type;

      // only process if we have not yet analyzed this array
      if (a && !a.__ballpark) {
        len = a.length;
        arrayCount++;

        if (len > 0) {
          arrayElementCount += len;

          for (n=0; n<len; n++) {

            type = getType(a[0]);

            if (type === 'array') {
              addArray(a[n]);
            }
            else if (type === 'object') {
              addObject(a[n]);
            }
            else {
              arrayElementSize += 8; 
            }
          }
        }

        // add crumb so that we do not double count the same object by reference
        a.__ballpark = true;
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