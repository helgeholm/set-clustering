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

  it('divides names into similar groups, based on edit distance', function() {
    var c = cluster(example1words, editDistancePercentage).similarGroups(0.5);

    assert(deepUnorderedEquals(
      c,
      [ [ 'norbert', 'albert' ],
        [ 'bernard' ],
        [ 'stephanie', 'stephen' ] ]
    ));
  });

  it('divides articles into 5 groups, based on tag similarity', function() {
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
    var groups = c.evenGroups(3);

    var titles = groups.map(function(group) {
      return group.map(function(article) {
        return article.title;
      });
    });

    assert(deepUnorderedEquals(
      titles,
      [ [ 'Safety online: How to set up your child\'s laptop',
          'Ubuntu quick start guide for accountants',
          'Top 10 most obnoxious linkbait titles' ],
        [ 'Stevebob looks at: The Last Federation',
          'The Last Federation beginner strategy guide' ],
        [ 'Pirate games for children age 4 to 8',
          'Games to run on a potato computer',
          'Good pets for your child',
          'Safely dissolving dead household pets',
          'Exploring the universe via household chemicals',
          'Factual mistakes in Breaking Bad' ] ]
    ));
  });
});
