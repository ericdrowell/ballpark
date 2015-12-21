/*
 * ballpark v0.1.0
 * JavaScript library for estimating object and array memory usage in the browser.
 * Release Date: 12-21-2015
 * https://github.com/ericdrowell/ballpark
 * Licensed under the MIT or GPL Version 2 licenses.
 *
 * Copyright (C) 2015 Eric Rowell @ericdrowell
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
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
          key, n, type;

      // only process if we have not yet analyzed this object
      if (!a.__ballpark) {
        objectCount++;

        if (len > 0) {
          for (key in a) {
            type = getType(a[key]);

            addKey(key);

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
      if (!a.__ballpark) {
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