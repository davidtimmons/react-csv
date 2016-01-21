/**
 * React CSV Spreadsheet v1.1.0
 * David Timmons (github@timmons.io)
 * http://david.timmons.io
 * MIT License
 *
 * Polyfills for ES2015 functions.
 */


// Array.prototype.fill()
// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill#Polyfill
if (!Array.prototype.fill) {
  Array.prototype.fill = function(value) {
    if (this == null) {
      throw new TypeError('this is null or not defined');
    }
    var O = Object(this);
    var len = O.length >>> 0;
    var start = arguments[1];
    var relativeStart = start >> 0;
    var k = relativeStart < 0 ?
      Math.max(len + relativeStart, 0) :
      Math.min(relativeStart, len);
    var end = arguments[2];
    var relativeEnd = end === undefined ?
      len : end >> 0;
    var final = relativeEnd < 0 ?
      Math.max(len + relativeEnd, 0) :
      Math.min(relativeEnd, len);
    while (k < final) {
      O[k] = value;
      k++;
    }
    return O;
  };
}
