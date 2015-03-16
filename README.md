__Set Clustering__ is a tool for grouping objects based on similarity.

## Short example, grouping a set of names:
```
var difflib = require('difflib');
var cluster = require('set-clustering');

var words = [
  'stephen',
  'albert',
  'stephanie',
  'bernard',
  'norbert',
];

// Words similarity is based on how much of a word needs to be changed
// to make it into the other.  E.g. "ABCD" and "QBCD" are 80% similar,
// while "A" and "B" are 0% similar.
function similarity(x, y) {
  return (new difflib.SequenceMatcher(null, x, y)).ratio();
}

var c = cluster(words, similarity);
```

Divide into two groups:
```
console.log(c.groups(2));
// > [ [ 'norbert', 'albert', 'bernard' ],
// >   [ 'stephanie', 'stephen' ] ]
```

Divide into three groups:
```
console.log(c.groups(3));
// > [ [ 'norbert', 'albert' ],
// >   [ 'bernard' ],
// >   [ 'stephanie', 'stephen' ] ]
```

## Long example, grouping a set of tagged articles:
```
var cluster = require('set-clustering');
```