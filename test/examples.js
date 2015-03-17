var cluster = require('../cluster');
var testTools = require('../test-tools');
var assert = require('assert');

var deepUnorderedEquals = testTools.deepUnorderedEquals;
var editDistancePercentage = testTools.editDistancePercentage;

describe('set-clustering behaves according to examples', function() {
  it('names into 2 groups, based on edit distance', function() {
    var words = [
      'stephen',
      'albert',
      'stephanie',
      'bernard',
      'norbert'
    ];

    var c = cluster(words, editDistancePercentage).groups(2);

    assert(deepUnorderedEquals(
      c,
      [ [ 'norbert', 'albert', 'bernard' ],
        [ 'stephanie', 'stephen' ] ]
    ));
  });
});
