var cluster = require('../cluster');
var testTools = require('../test-tools');
var assert = require('assert');

describe('set-clustering behaves according to examples', function() {
  var deepUnorderedEquals = testTools.deepUnorderedEquals;
  var editDistancePercentage = testTools.editDistancePercentage;
  var example1words = [
    'stephen',
    'albert',
    'stephanie',
    'bernard',
    'norbert'
  ];

  it('divides names into 2 groups, based on edit distance', function() {
    var c = cluster(example1words, editDistancePercentage).groups(2);

    assert(deepUnorderedEquals(
      c,
      [ [ 'norbert', 'albert', 'bernard' ],
        [ 'stephanie', 'stephen' ] ]
    ));
  });

  it('divides names into 3 groups, based on edit distance', function() {
    var c = cluster(example1words, editDistancePercentage).groups(3);

    assert(deepUnorderedEquals(
      c,
      [ [ 'norbert', 'albert' ],
        [ 'bernard' ],
        [ 'stephanie', 'stephen' ] ]
    ));
  });
});
