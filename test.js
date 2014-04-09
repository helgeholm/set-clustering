var difflib = require('difflib');
var cluster = require('./cluster');

var data = require('./words');
data = ['aa', 'ab', 'ac', 'bb', 'bc', 'bd', 'z', 'y'];

function similarity(x, y) {
  return (new difflib.SequenceMatcher(null, x, y)).ratio();
}

/*
var threshold = 0.4285714289;
var graph = require('./lib/graph');
var g = graph.create(data, similarity);
var t = graph.threshold(g, threshold);
var c = graph.connected(t, 100);
console.log(threshold, c.length, c[0].nodes.length);
*/

var c = cluster(data, similarity).evenGroups(2);

console.log(c);
console.log(c.length);
