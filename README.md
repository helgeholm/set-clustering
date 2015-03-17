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
  'norbert'
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
var articles = [
  { title: "The Last Federation beginner strategy guide",
    tags: [ 'games', 'strategy', 'guide', 'the last federation' ] },
  { title: "Exploring the universe via household chemicals",
    tags: [ 'woah', 'chemistry', 'illegal' ] },
  { title: "Top 10 most obnoxious linkbait titles",
    tags: [ 'seo', 'top10', 'guide', 'internet', 'web' ] },
  { title: "Safely dissolving dead household pets",
    tags: [ 'chemistry', 'pets' ] },
  { title: "Games to run on a potato computer",
    tags: [ 'games', 'top10', 'pc' ] },
  { title: "Ubuntu quick start guide for accountants",
    tags: [ 'pc', 'linux', 'ubuntu', 'guide' ] },
  { title: "Factual mistakes in Breaking Bad",
    tags: [ 'tv series', 'science', 'chemistry' ] },
  { title: "Stevebob looks at: The Last Federation",
    tags: [ 'games', 'the last federation', 'review' ] },
  { title: "Safety online: How to set up your child's laptop",
    tags: [ 'pc', 'parenting', 'guide' ] },
  { title: "Good pets for your child",
    tags: [ 'pets', 'parenting' ] },
  { title: "Pirate games for children age 4 to 8",
    tags: [ 'games', 'parenting' ] }
];

// Base similarity on number of common tags.
function similarity(x, y) {
  var score = 0;
  x.tags.forEach(function(tx) {
    y.tags.forEach(function(ty) {
      if (tx == ty)
        score += 1;
    });
  });
  return score;
}

var c = cluster(articles, similarity);
```

Divide into three groups and print titles:
```
var groups = c.evenGroups(3);

var titles = groups.map(function(group) {
  return group.map(function(article) {
    return article.title;
  });
});
console.log(titles);
// [ [ 'Safety online: How to set up your child\'s laptop',
//     'Ubuntu quick start guide for accountants',
//     'Top 10 most obnoxious linkbait titles' ],
//   [ 'Stevebob looks at: The Last Federation',
//     'The Last Federation beginner strategy guide' ],
//   [ 'Pirate games for children age 4 to 8',
//     'Games to run on a potato computer',
//     'Good pets for your child',
//     'Safely dissolving dead household pets',
//     'Exploring the universe via household chemicals',
//     'Factual mistakes in Breaking Bad' ] ]
```
