var graph = require('./lib/graph');

module.exports = function(set, similarity) {
  function checkedSim(x, y) {
    var sim = similarity(x, y);
    if (typeof sim != 'number' ||
        sim < 0)
      throw new Error('Similarity function did not yield a number in the range [0, +Inf) when comparing ' + x + ' to ' + y + ' : ' + sim);
    return sim;
  }

  var g = graph.create(set, checkedSim);

  function diverse(numGroups, searchDepth_) {
    var searchDepth = searchDepth_ || 10;
    var subGraphs = graph.divide(g, numGroups, searchDepth);
    var roots = subGraphs.map(graph.findCenter);
    return roots.map(graph.data);
  }

  function group(numGroups, searchDepth_) {
    var searchDepth = searchDepth_ || 10;
    var subGraphs = graph.divide(g, numGroups, searchDepth);
    var roots = subGraphs.map(graph.findCenter);
    var divisions = graph.growFromNuclei(g, roots);
    var groups = divisions.map(function(g) {
      return g.nodes.map(graph.data);
    });
    return groups;
  }

  return {
    diverse: diverse,
    group: group
  };
}
