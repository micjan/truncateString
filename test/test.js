var assert = require('assert');
var truncateString = require('../index.js');

describe('truncateString', function() {
  it('should truncate String correctly', function() {
    assert.equal(truncateString('String', 3), 'Str');
  });
});
