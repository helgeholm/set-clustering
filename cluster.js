var graph = require('./lib/graph');

var DEFAULT_SEARCH_DEPTH = 1000;

module.exports = function(set, similarity) {
  function checkedSim(x, y) {
    var sim = similarity(x, y);
    if (typeof sim != 'number' ||
        sim < 0)
      throw new Error('Similarity function did not yield a number in the range [0, +Inf) when comparing ' + x + ' to ' + y + ' : ' + sim);
    return sim;
  }

  var g = graph.create(set, checkedSim);

  function stripNodes(realFunction) {
    return function(/* args */) {
      var nodes = realFunction.apply(this, Array.prototype.slice.call(arguments));
      return nodes.map(graph.data);
    }
  }

  function stripGraphs(realFunction) {
    return function(/* args */) {
      var graphs = realFunction.apply(this, Array.prototype.slice.call(arguments));
      return graphs.map(function(g) {
        return g.nodes.map(graph.data);
      });
    }
  }

  function groups(numGroups, searchDepth_) {
    var searchDepth = searchDepth_ || DEFAULT_SEARCH_DEPTH;
    var subGraphs = graph.divide(g, numGroups, searchDepth);
    return subGraphs;
  }

  function representatives(numGroups, searchDepth_) {
    var subGraphs = groups(numGroups, searchDepth_);

    // Cut down to required size by removing the smallest groups.
    subGraphs.sort(function(x, y) {
      return y.nodes.length - x.nodes.length;
    });
    subGraphs.splice(numGroups);

    var roots = subGraphs.map(graph.findCenter);
    return roots;
  }

  function evenGroups(numGroups, searchDepth_) {
    var roots = representatives(numGroups);
    var divisions = graph.growFromNuclei(g, roots);
 
    var groups = divisions.graphs.map(function(g) {
      return g.nodes.map(graph.data);
    });

    while (divisions.orphans.length) {
      var o = graph.data(divisions.orphans.pop());
      groups.sort(function(x, y) { return x.length - y.length; });
      groups[0].push(o);
    }

    return groups;
  }

  return {
    groups: stripGraphs(groups),
    representatives: stripNodes(representatives),
    evenGroups: evenGroups
  };
}
