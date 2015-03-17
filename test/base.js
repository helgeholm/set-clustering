var cluster = require('../cluster');
var testTools = require('../test-tools');
var assert = require('assert');

describe('set-clustering can be used as described', function() {
  var deepUnorderedEquals = testTools.deepUnorderedEquals;

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

  it('can group 3 items into 3 groups', function() {
    assert.doesNotThrow(function() {
      var c = cluster([1, 2, 3], function similarity() { return 0; });
      var g = c.groups(3);
      assert(deepUnorderedEquals(g, [[1], [2], [3]]));
    });
  });

  it('can distribute 6 items into 3 even groups', function() {
    assert.doesNotThrow(function() {
      var c = cluster([1, 2, 3, 4, 5, 6], function similarity() { return 0; });
      var g = c.evenGroups(3);
      assert.equal(g.length, 3);
      assert.equal(g[0].length, 2);
      assert.equal(g[1].length, 2);
      assert.equal(g[2].length, 2);
    });
  });

  it('can pick out 2 representatives from 10 elements', function() {
    assert.doesNotThrow(function() {
      function similarity(x, y) {
        dist = Math.abs(x - y);
        if (dist == 0) return 0;
        return 1 / Math.abs(x - y);
      };
      var c = cluster([1, 2, 3, 4, 5, 11, 12, 13, 14, 15], similarity);
      var r = c.representatives(2);
      assert(deepUnorderedEquals(r, [3, 13]));
    });
  });
});
