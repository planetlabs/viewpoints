function intern(column) {
  // Given just a single column of data, check for strings.
  // For any strings that are found, intern them
  var enums = new Map();
  var enumCount = 0;
  var nonEnumCount = 0;
  var newColumn = [];
  for (var i = 0; i < column.length; i++) {
    var val = column[i];
    if (typeof val == 'string') {
      var location = enums.get(val);
      if (typeof location !== 'undefined') {
        val = location;
      }
      else {
        var proxyVal = enums.size;
        enums.set(val, proxyVal);
        val = proxyVal;
      }
      enumCount++;
    }
    else {
      nonEnumCount++;
    }
    newColumn.push(val);
  }

  var errors = [];
  // if (nonEnumCount === 0 || enumCount === 0) {
  //   console.log("nice and clean data");
  // }
  // if (nonEnumCount > 0 && enumCount > 0 && enums.size === 1) {
  //   console.log("mostly nums but there were some nodatas");
  // }
  if (nonEnumCount > 0 && enumCount > 0 && enums.size > 1) {
    errors.push("some values were meant to be floats, others were meant to be interned...");
  }

  return {
    newColumn: newColumn,
    enums: enums,
    errors: errors
  };
}

module.exports = intern;
