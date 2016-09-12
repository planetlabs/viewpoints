// File name: csv.js
// Description: Utility function for interning strings in a csv file

// Copyright 2016 Planet Labs Inc.

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//   http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
// implied. See the License for the specific language governing permissions and
// limitations under the License.

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

  var reverseEnums = new Map();
  enums.forEach(function(val, key) {
    reverseEnums.set(val, key);
  });

  return {
    newColumn: newColumn,
    enums: reverseEnums,
    errors: errors
  };
}

module.exports = intern;
