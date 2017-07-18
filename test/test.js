var assert = require('assert');
var truncateString = require('../index.js');

describe('truncateString', function() {
  it('should truncate String without options', function() {
    assert.equal(truncateString('Lorem Ipsum', 3), 'Lor…');
    assert.equal(truncateString('Lorem Ipsum', 5), 'Lorem…');
    assert.equal(truncateString('Lorem Ipsum', 6), 'Lorem …'); // Space is not cut off
    assert.equal(truncateString('Lorem Ipsum', 8), 'Lorem Ip…');
    assert.equal(truncateString('Lorem Ipsum', 11), 'Lorem Ipsum'); // Exact string-length
    assert.equal(truncateString('Lorem Ipsum', 12), 'Lorem Ipsum'); // Greater length than string-length
  });

  it('should handle incorrect params', function() {
    assert.equal(truncateString(), '');
    assert.equal(truncateString('Lorem Ipsum'), 'Lorem Ipsum');
    assert.equal(truncateString('Lorem Ipsum', '3'), 'Lorem Ipsum');
    assert.equal(truncateString('Lorem Ipsum', -3), 'Lorem Ipsum');
    assert.equal(truncateString(3), '');
    assert.equal(truncateString(null), '');
    assert.equal(truncateString(null, 3), '');
  });

  // The ellipsis is the string that is appended to the shortened(!) string.
  // If the string wasn't shortened, the ellipsis will not be appended.
  // The default ellipsis is '…'.
  it('should truncate String with valid elipsis-option', function() {
    assert.equal(truncateString('Lorem Ipsum', 3, { ellipsis: '...' }), 'Lor...');
    assert.equal(truncateString('Lorem Ipsum', 3, { ellipsis: '' }), 'Lor');
  });

  it('should truncate String with invalid ellipsis-option', function() {
    assert.equal(truncateString('Lorem Ipsum', 3, { ellipsis: null }), 'Lor…');
    assert.equal(truncateString('Lorem Ipsum', 3, { ellipsis: undefined }), 'Lor…');
    assert.equal(truncateString('Lorem Ipsum', 3, { ellipsis: 42 }), 'Lor…');
  });

  // The 'threshold'-option is the length the string has to surpass so it is shortened to the 'length'.
  // The default threshold is the length.
  it('should truncate String with valid threshold-option', function() {
    assert.equal(truncateString('Lorem Ipsum', 3, { threshold: 3 }), 'Lor…'); // threshold === length => should not make a difference
    assert.equal(truncateString('Lorem Ipsum', 8, { threshold: 10 }), 'Lorem Ip…'); // threshold < string.length => string is shortened
    assert.equal(truncateString('Lorem Ipsum', 8, { threshold: 11 }), 'Lorem Ipsum'); // threshold === string.length => string is not shortened
    assert.equal(truncateString('Lorem Ipsum', 8, { threshold: 12 }), 'Lorem Ipsum'); // threshold > string.length => string is not shortened
    assert.equal(truncateString('Lorem Ipsum', 8, { threshold: 5 }), 'Lorem Ip…'); // threshold < length && length < string.length => string is shortened to length
    assert.equal(truncateString('Lorem Ipsum', 12, { threshold: 5 }), 'Lorem Ipsum'); // threshold < length && length > string.length => string is not shortened
  });

  it('should truncate String with invalid threshold-option', function() {
    assert.equal(truncateString('Lorem Ipsum', 3, { threshold: -3 }), 'Lor…');
    assert.equal(truncateString('Lorem Ipsum', 3, { threshold: '12' }), 'Lor…');
    assert.equal(truncateString('Lorem Ipsum', 3, { threshold: 0 }), 'Lor…');
    assert.equal(truncateString('Lorem Ipsum', 3, { threshold: null }), 'Lor…');
    assert.equal(truncateString('Lorem Ipsum', 3, { threshold: undefined }), 'Lor…');
  });
});
