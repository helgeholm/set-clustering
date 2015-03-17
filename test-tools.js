var difflib = require('difflib');

module.exports.deepUnorderedEquals = deepUnorderedEquals;
module.exports.editDistancePercentage = editDistancePercentage;

// Deep list equality test, Ignores ordering.
function deepUnorderedEquals(list1, list2) {
  // recursion base: not lists
  if (!Array.isArray(list1) ||
      !Array.isArray(list2))
    return list1 == list2;

  // Unequal length, trivially unequal
  if (list1.length != list2.length)
    return false;

  // Try to match up every element in list1 with a unique element in list2
  var found1 = [];
  var found2 = [];
  list1.forEach(function(e1, i1) {
    list2.forEach(function(e2, i2) {
      if (!found2[i2] && deepUnorderedEquals(e1, e2)) {
        found1[i1] = true;
        found2[i2] = true;
      }
    });
  });

  // Check that all elements in both lists are matched
  for (var i=0; i < list1.length; i++)
    if (!found1[i] || !found2[i])
      return false;

  return true;
}

// Edit distance as 0-100 percentage
function editDistancePercentage(x, y) {
  return (new difflib.SequenceMatcher(null, x, y)).ratio();
}
