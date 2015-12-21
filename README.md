# ballpark

ballpark is a JavaScript library that estimates the memory usage of objects and arrays in the browser.  

### API

```
var obj = {
  foo: 1,
  bar: [1, 2]
};

var size = ballpark(obj).size;
```

### All Properties

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
