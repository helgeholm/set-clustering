# cluster.js

[![NPM](https://nodei.co/npm/set-clustering.png)](https://nodei.co/npm/set-clustering/)

__Set Clustering__ is a tool for grouping objects based on similarity.

Give an array of arbitrary elements, and a function to determine how
similar two elemts are.  The elements can then be divided into a
number of groups to your liking.  The elements in each group will be
more similar to each other than to elements of other groups.

(See end of README for [algorithm description](#algorithm).)

<a name="download" />
## Download

For [Node.js](http://nodejs.org/), use [npm](http://npmjs.org/):

    npm install set-clustering

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

<a name="documentation" />
# Documentation

## Constructor

* [cluster](#cluster)

## Instance Functions

* [groups](#groups)
* [representatives](#representatives)
* [evenGroups](#evenGroups)

-----------------------------------

<a name="cluster" />
## cluster(elements, similarityFunction)

Returns a new `cluster` instance, which is an object with 3 functions:

* [groups](#groups)
* [representatives](#representatives)
* [evenGroups](#evenGroups)

__Arguments__

* elements - An array of elements you want to group.  The elements themselves can be anything.
* similarityFunction - A function that takes any two elements and returns a number `>= 0`, where higher numbers mean "more similar" and lower numbers mean "less similar".

__Example__

```javascript
var c = cluster(
    [1, 2, 3, 23, 24, 25],
    function quadraticDropOff(e1, e2) { return 1 / Math.Pow(e1 - e2, 2); }
);
```

-----------------------------------

<a name="groups" />
## groups(howMany)

The elements provided in the constructor are divided into `howMany` number of groups, and
returned as an `Array` of `Array`s.

__Arguments__

* howMany - Number of groups to divide the elements into.  Must be `> 0`.

__Example__

```javascript
var c = cluster(
    [1, 2, 3, 4, 5, 23, 24, 25],
    function quadraticDropOff(e1, e2) { return 1 / Math.Pow(e1 - e2, 2); }
);

var g = c.groups(2);

console.log(g);

// [ [1, 2, 3, 4, 5],
     [23, 24, 25] ]
```

-----------------------------------


<a name="representatives" />
## representatives(howMany)

Assuming the given elements can be divided into `howMany` number of groups, find the
"center" member of each group and return them as an `Array`.

__Arguments__

* howMany - Number of representative elements to pick.  Must be `> 0`.

__Example__

```javascript
var c = cluster(
    [1, 2, 3, 4, 5, 23, 24, 25],
    function quadraticDropOff(e1, e2) { return 1 / Math.Pow(e1 - e2, 2); }
);

var g = c.representatives(2);

console.log(g);

// [ 3, 24 ]
```

-----------------------------------

<a name="evenGroups" />
## evenGroups(howMany)

Like [groups(howMany)](#groups) but strives to keep the groups as
evenly sized as possible.  This means that the outliers of one large
group can be absorbed into the most similar small group.

Returns `howMany` number of groups, where the size of each group is at
most `1` larger or smaller than any other group.  Return value is an
`Array` or `Array`s.

__Arguments__

* howMany - Number of groups to divide the elements into.  Must be `> 0`.

__Example__

```javascript
var c = cluster(
    [1, 2, 3, 4, 5, 23, 24, 25],
    function quadraticDropOff(e1, e2) { return 1 / Math.Pow(e1 - e2, 2); }
);

var g = c.evenGroups(2);

console.log(g);

// [ [1, 2, 3, 4],
     [5, 23, 24, 25] ]
```

-----------------------------------

<a name="algorithm" />
# Algorithm

Given `N` nodes, and asked to divide into `M` groups.

1. Create a graph `G` of size `N` with all elements as nodes.
2. Add `N*N` edges, where the similarity between each pair of nodes are the edges.
3. Remove "weakest" edge.
4. See if the graph consists of at least `M` disconnected subgraphs.
5. If no, repeat from step 3.
6. Divide `G` into `G_1`, `G_2` ... `G_M`, picking the largest subgraphs first.
7. In the case of the graph having more than `M` disconnected subgraphs, absorb every orphan into the nearest (according to the original edge strength) subgraph from step 6.
8. Return a list for each subgraph `G_1`, `G_2` ... `G_M`, where each list contains the nodes (original elements) of that subgraph.

When picking representatives instead of groups, calculate the center node of each subgraph and return only that per subgraph.

When picking even groups, start with representatives.  Create one subgraph for each representative, and "grow" them outwards evenly from each by picking the nearest neighboring free node until the entire graph is covered.
