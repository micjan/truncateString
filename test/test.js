var assert = require('assert');
var truncateString = require('../dist/truncateString.min.js');

describe('truncateString', function () {
  it('should truncate String without options', function () {
    assert.equal(truncateString('Lorem ipsum', 3), 'Lor…');
    assert.equal(truncateString('Lorem ipsum', 5), 'Lorem…');
    assert.equal(truncateString('Lorem ipsum', 6), 'Lorem…'); // Space is not cut off by default
    assert.equal(truncateString('Lorem ipsum', 8), 'Lorem ip…');
    assert.equal(truncateString('Lorem ipsum', 11), 'Lorem ipsum'); // Exact string-length
    assert.equal(truncateString('Lorem ipsum', 12), 'Lorem ipsum'); // Greater length than string-length
  });

  it('should handle incorrect params', function () {
    assert.equal(truncateString(), '');
    assert.equal(truncateString('Lorem ipsum'), 'Lorem ipsum');
    assert.equal(truncateString('Lorem ipsum', '3'), 'Lorem ipsum');
    assert.equal(truncateString('Lorem ipsum', -3), 'Lorem ipsum');
    assert.equal(truncateString(3), '');
    assert.equal(truncateString(null), '');
    assert.equal(truncateString(null, 3), '');
  });

  // The appendix is the string that is appended to the shortened(!) string.
  // If the string wasn't shortened, the appendix will not be appended.
  // The default appendix is '…'.
  it('should truncate String with valid elipsis-option', function () {
    assert.equal(truncateString('Lorem ipsum', 3, { appendix: '...' }), 'Lor...');
    assert.equal(truncateString('Lorem ipsum', 3, { appendix: '' }), 'Lor');
  });

  it('should truncate String with invalid appendix-option', function () {
    assert.equal(truncateString('Lorem ipsum', 3, { appendix: null }), 'Lor…');
    assert.equal(truncateString('Lorem ipsum', 3, { appendix: undefined }), 'Lor…');
    assert.equal(truncateString('Lorem ipsum', 3, { appendix: 42 }), 'Lor…');
  });

  // The 'threshold'-option is the length the string has to surpass
  // so it is shortened to the 'length'. The default threshold is the length.
  it('should truncate String with valid threshold-option', function () {
    assert.equal(truncateString('Lorem ipsum', 3, { threshold: 3 }), 'Lor…'); // threshold === length => should not make a difference
    assert.equal(truncateString('Lorem ipsum', 8, { threshold: 10 }), 'Lorem ip…'); // threshold < string.length => string is shortened
    assert.equal(truncateString('Lorem ipsum', 8, { threshold: 11 }), 'Lorem ipsum'); // threshold === string.length => string is not shortened
    assert.equal(truncateString('Lorem ipsum', 8, { threshold: 12 }), 'Lorem ipsum'); // threshold > string.length => string is not shortened
    assert.equal(truncateString('Lorem ipsum', 8, { threshold: 5 }), 'Lorem ip…'); // threshold < length && length < string.length => string is shortened to length
    assert.equal(truncateString('Lorem ipsum', 12, { threshold: 5 }), 'Lorem ipsum'); // threshold < length && length > string.length => string is not shortened
  });

  it('should truncate String with invalid threshold-option', function () {
    assert.equal(truncateString('Lorem ipsum', 3, { threshold: -3 }), 'Lor…');
    assert.equal(truncateString('Lorem ipsum', 3, { threshold: '12' }), 'Lor…');
    assert.equal(truncateString('Lorem ipsum', 3, { threshold: 0 }), 'Lor…');
    assert.equal(truncateString('Lorem ipsum', 3, { threshold: null }), 'Lor…');
    assert.equal(truncateString('Lorem ipsum', 3, { threshold: undefined }), 'Lor…');
  });

  // The 'trim'-option determines if any spaces are cut off on the truncated
  // side of the string. By default this is true.
  // There are no tests on invalid values because options.trim
  // is handled as truthy/falsey internally.
  it('should truncate String with valid trim-option', function () {
    assert.equal(truncateString('Lorem ipsum', 6, { trim: false }), 'Lorem …');
    assert.equal(truncateString('Lorem ipsum dolor', 12, { trim: false }), 'Lorem ipsum …');
    assert.equal(truncateString('Lorem     ipsum', 8, { trim: false }), 'Lorem   …');
    assert.equal(truncateString('Lorem ipsum', 6, { trim: true }), 'Lorem…');
    assert.equal(truncateString('Lorem ipsum dolor', 12, { trim: true }), 'Lorem ipsum…');
    assert.equal(truncateString('Lorem     ipsum', 8, { trim: true }), 'Lorem…');
    assert.equal(truncateString('  Lorem ipsum  ', 8, { trim: false }), '  Lorem …');
    assert.equal(truncateString('  Lorem  ', 20, { trim: false }), '  Lorem  ');
  });

  // The cutChars-array contains characters that mark the places of the string
  // where it can be cut. Starting at the intended cut-position the shortest distance
  // to any of the chars is measured. When the nearest char (to the left OR right)
  // is found the cut will be made there.
  it('should truncate String with valid cutChars-option', function () {
    assert.equal(truncateString('Lorem ipsum-dolor sit', 8, { cutChars: ' ' }), 'Lorem…');
    assert.equal(truncateString('Lorem ipsum-dolor sit', 8, { cutChars: [' '] }), 'Lorem…');
    assert.equal(truncateString('Lorem ipsum-dolor sit', 13, { cutChars: [' '] }), 'Lorem ipsum-dolor…');
    assert.equal(truncateString('Lorem ipsum-dolor sit', 2, { cutChars: ['-'] }), '…');
    assert.equal(truncateString('Lorem ipsum-dolor sit', 8, { cutChars: ['-'] }), 'Lorem ipsum-…');
    assert.equal(truncateString('Lorem ipsum-dolor sit', 2, { cutChars: [' ', '-'] }), '…'); // Since 2 is closer to the start of the string (pos = 0) than the first space (pos = 5) the cut is made at position 0 and only the ellipsis is returned.
    assert.equal(truncateString('Lorem ipsum-dolor sit', 3, { cutChars: [' ', '-'] }), 'Lorem…'); // Here on the other hand the cut at 3 is closer to the first space, so the result is "Lorem…"
    assert.equal(truncateString('Lorem ipsum-dolor sit', 5, { cutChars: [' ', '-'] }), 'Lorem…');
    assert.equal(truncateString('Lorem ipsum-dolor sit', 6, { cutChars: [' ', '-'] }), 'Lorem…'); // The dangling space is removed by the trim option (default = true)
    assert.equal(truncateString('Lorem ipsum-dolor sit', 6, { cutChars: [' ', '-'], trim: false }), 'Lorem …'); // Now the dangling space should be there
    assert.equal(truncateString('Lorem ipsum-dolor sit', 7, { cutChars: [' ', '-'] }), 'Lorem…');
    assert.equal(truncateString('Lorem ipsum-dolor sit', 9, { cutChars: [' ', '-'] }), 'Lorem ipsum-…'); // The cut is made AFTER every cutChar so it will be part of the returned string. Only spaces are trimmed if the trim-options says so.
    assert.equal(truncateString('Lorem ipsum-dolor sit', 11, { cutChars: [' ', '-'] }), 'Lorem ipsum-…');
    assert.equal(truncateString('Lorem ipsum-dolor sit', 12, { cutChars: [' ', '-'] }), 'Lorem ipsum-…');
    assert.equal(truncateString('Lorem ipsum-dolor sit', 14, { cutChars: [' ', '-'] }), 'Lorem ipsum-…');
    assert.equal(truncateString('Lorem ipsum-dolor sit', 16, { cutChars: [' ', '-'] }), 'Lorem ipsum-dolor…');
    assert.equal(truncateString('Lorem ipsum-dolor sit', 19, { cutChars: [' ', '-'] }), 'Lorem ipsum-dolor…');
    assert.equal(truncateString('Lorem ipsum-dolor sit', 20, { cutChars: [' ', '-'] }), 'Lorem ipsum-dolor sit'); // 20 is closer to the string-end than the last space before "sit". So the string is not cut at all and returned without ellipsis.
  });

  it('should truncate String with invalid cutChars-option', function () {
    assert.equal(truncateString('Lorem ipsum-dolor sit', 7, { cutChars: ['sum'] }), 'Lorem i…'); // Since cutChars contains no valid chars the option will be ignored completely
    assert.equal(truncateString('Lorem ipsum-dolor sit', 7, { cutChars: 'sum' }), 'Lorem i…'); // Here too
    assert.equal(truncateString('Lorem ipsum-dolor sit', 12, { cutChars: [' ', 'sum'] }), 'Lorem ipsum-dolor…');
    assert.equal(truncateString('Lorem ipsum2dolor sit', 13, { cutChars: 2 }), 'Lorem ipsum2d…');
    assert.equal(truncateString('Lorem ipsum2dolor sit', 13, { cutChars: [' ', 2] }), 'Lorem ipsum2dolor…');
  });
});
