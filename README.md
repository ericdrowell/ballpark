# ballpark

ballpark is a JavaScript library that estimates the memory usage of objects and arrays in the browser.  The API is really simple:

```
var obj = {
  foo: 1,
  bar: [1, 2]
};

var size = ballpark(obj).size;
```

The ballpark function returns the following object which is useful for seeing the breakdown of memory usage:

```
{
  arrayCount: 1
  arrayElementCount: 2
  arrayElementSize: 16
  formattedSize: "39 B"
  objectCount: 1
  objectElementSize: 8
  objectKeyCount: 2
  objectKeySize: 15
  size: 39
}
```
