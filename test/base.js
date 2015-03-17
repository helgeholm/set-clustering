var cluster = require('../cluster');
var assert = require('assert');

describe('set-clustering can be used as described', function() {
  it('can be required', function() {
    assert(cluster);
  });

  it('can be called as a function', function() {
    assert.doesNotThrow(function() {
      cluster([], function similarity() { return 0; });
    });
  });

  it('can be asked for groups', function() {
    assert.doesNotThrow(function() {
      var c = cluster([1], function similarity() { return 0; });
      c.groups(1);
    });
  });

  it('can be asked for even groups', function() {
    assert.doesNotThrow(function() {
      var c = cluster([1], function similarity() { return 0; });
      c.evenGroups(1);
    });
  });

  it('can be asked for representatives', function() {
    assert.doesNotThrow(function() {
      var c = cluster([1], function similarity() { return 0; });
      c.representatives(1);
    });
  });
});
