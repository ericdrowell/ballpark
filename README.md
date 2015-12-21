# ballpark

ballpark is a JavaScript library that estimates the memory usage of objects and arrays in the browser.  The API is really simple:

```
var obj = {
  foo: 1,
  bar: [1, 2]
};

var size = ballpark(obj).size;
```

The ballpark functions returns the following object which is useful for seeing the breakdown of memory usage:

```
{
  arrayCount: 0
  arrayElementCount: 0
  arrayElementSize: 0
  formattedSize: "31 B"
  objectCount: 1
  objectElementSize: 16
  objectKeyCount: 2
  objectKeySize: 15
  size: 31
}
```
