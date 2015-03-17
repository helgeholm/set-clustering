/* Graph format:
 * {
 *    nodes: Array of node objects,
 *    edges: 2D lookup table for edge weight between two nodes.
 *           Lookup key is node object id.
 *           No edge value OR edge weight zero means "no edge".
 * }
 *
 * Node object format:
 * {
 *    id: generated unique id.
 *    data: Anything at all.
 * }
 */

function createGraph(nodeData, similarity) {
  var edges = {};
  var counter_id = 1;
  var nodes = nodeData.map(function(d) { return { id: counter_id++, data: d }; });

  nodes.forEach(function(m) {
    edges[m.id] = edges[m.id] || {};
    nodes.forEach(function(n) {
      if (m === n)
        return;
      var s = similarity(m.data, n.data);
      edges[m.id][n.id] = s;
      edges[n.id] = edges[n.id] || {};
      edges[n.id][m.id] = s;
    });
  });

  return {
    nodes: nodes,
    edges: edges
  };
};

function distanceMatrix(graph) {
  var dist = {};
  graph.nodes.forEach(function(n) {
    dist[n.id] = {};
    dist[n.id][n.id] = 0;
  });
  graph.nodes.forEach(function(n) {
    graph.nodes.forEach(function(m) {
      if (n == m)
        return;
      var w = graph.edges[n.id] && graph.edges[n.id][m.id];
      if (w == undefined)
        w = Infinity;
      dist[n.id][m.id] = w;
    });
  });
  graph.nodes.forEach(function(k) {
    graph.nodes.forEach(function(i) {
      graph.nodes.forEach(function(j) {
        var d_ikj = dist[i.id][k.id] + dist[k.id][j.id];
        if (dist[i.id][j.id] > d_ikj)
          dist[i.id][j.id] = d_ikj;
      });
    });
  });
  return dist;
}

function findCenter(graph) {
  var dist = distanceMatrix(graph);
  var minMaxDist = Infinity;
  var n_minMaxDist = null;
  graph.nodes.forEach(function(n) {
    var maxDist = 0;
    graph.nodes.forEach(function(m) {
      var d = dist[n.id][m.id];
      if (d > maxDist)
        maxDist = d;
    });
    if (minMaxDist > maxDist) {
      minMaxDist = maxDist;
      n_minMaxDist = n;
    }
  });
  return n_minMaxDist;
}

function connectedSubgraphs(graph, similarityThreshold) {
  var untouchedNodes = graph.nodes.slice();
  var graphs = [];

  if (!untouchedNodes.length)
    return graphs;
  
  // nodes to try and spread current subgraph from
  var ns = [];
  // current subgraph
  var cur = null;

  while (untouchedNodes.length) {
    // reached end of current subgraph?
    if (!ns.length) {
      if (cur)
        graphs.push(cur);
      ns = [ untouchedNodes.pop() ];
      cur = {
        nodes: ns.slice(),
        edges: {}
      };
    }

    while (ns.length) {
      var n = ns.pop();
      for (var x = untouchedNodes.length - 1; x >= 0; x--) {
        var m = untouchedNodes[x];
        if (graph.edges[n.id] && graph.edges[n.id][m.id] >= similarityThreshold) {
          ns.push(m);
          cur.nodes.push(m);
          cur.edges[n.id] = cur.edges[n.id] || {};
          cur.edges[n.id][m.id] = graph.edges[n.id][m.id];
          cur.edges[m.id] = cur.edges[m.id] || {};
          cur.edges[m.id][n.id] = graph.edges[m.id][n.id];
          var un2 = untouchedNodes.slice(0, x).concat(untouchedNodes.slice(x + 1));
          untouchedNodes = un2;
        }
      }
    };
  }
  
  if (cur)
    graphs.push(cur);

  return graphs;
};

function analyzeSizeDist(sizes) {
  var sum = 0;
  sizes.forEach(function(s) {
    sum += s;
  });
  var mean = sum / sizes.length;
  var balance = 0;
  sizes.forEach(function(s) {
    balance += Math.pow(s - mean, 2);
  });
  return {
    mean: mean,
    stdDev: Math.sqrt(balance)
  };
}

function highestWeight(graph) {
  var hi = 0;
  graph.nodes.forEach(function(n) {
    graph.nodes.forEach(function(m) {
      var w = graph.edges[n.id][m.id];
      if (w && w > hi)
        hi = w;
    });
  });
  return hi;
}

// Divide into n graphs, where n is at least numGraphs, and as close to numGraphs as possible.
function divideInto(graph, numGraphs, attemptDepth) {
  var bestDiff = Infinity;
  var lo = 0;
  var hi = highestWeight(graph) + 1;
  var best = null;
  
  for (var attempts = -2; attempts < attemptDepth; attempts++) {
    var similarity;
    if (attempts == -2)
      similarity = lo;
    else if (attempts == -1)
      similarity = hi;
    else
      similarity = (hi + lo) / 2;

    var c = connectedSubgraphs(graph, similarity);
    
    var diff = c.length - numGraphs;
    if (diff < bestDiff && diff >= 0) {
      bestDiff = diff;
      best = c;
    }

    if (c.length > numGraphs)
      hi = similarity;
    if (c.length < numGraphs)
      lo = similarity;
    
    if (c.length == numGraphs)
      break;

    if (lo == hi)
      break;
  }
  
  return best;
};

function id(x) { return x; }

// Severely suboptimal implementations
function growFromNuclei(graph, nuclei) {
  var subGraphs = nuclei.map(function(n) {
    return {
      nodes: [ n ],
      edges: {}
    };
  });
  var unclaimedNodes = graph.nodes.filter(function(n) {
    // true for graph nodes not in nuclei
    return nuclei.filter(function(m) {
      return n == m;
    }).length == 0;
  });

  var currentGrowGraphIdx = 0;
  var noGrowthDetector = subGraphs.length;
  while (unclaimedNodes.length && noGrowthDetector) {
    noGrowthDetector -= 1;
    var g = subGraphs[currentGrowGraphIdx];
    currentGrowGraphIdx = (currentGrowGraphIdx + 1) % subGraphs.length;
    var closestNeighborN = null;
    var closestNeighborM = null;
    var closestNeighborDist = -Infinity;
    g.nodes.forEach(function(n) {
      unclaimedNodes.forEach(function(m) {
        var d = graph.edges[n.id] && graph.edges[n.id][m.id];
        if (d && d > closestNeighborDist) {
          closestNeighborN = n;
          closestNeighborM = m;
          closestNeighborDist = d;
        }
      });
    });
    if (closestNeighborN) {
      var n = closestNeighborN;
      var m = closestNeighborM;
      g.edges[n.id] = g.edges[n.id] || {};
      g.edges[n.id][m.id] = graph.edges[n.id][m.id];
      g.edges[m.id] = g.edges[m.id] || {};
      g.edges[m.id][n.id] = graph.edges[m.id][n.id];
      g.nodes.push(closestNeighborM);
      unclaimedNodes = unclaimedNodes.filter(function(n) {
        return n != closestNeighborM;
      });
      noGrowthDetector = subGraphs.length;
    }
  }
  return { graphs: subGraphs,
           orphans: unclaimedNodes };
}

function data(node) {
  return node.data;
}

module.exports = {
  create: createGraph,
  data: data,
  connected: connectedSubgraphs,
  divide: divideInto,
  findCenter: findCenter,
  growFromNuclei: growFromNuclei
};
