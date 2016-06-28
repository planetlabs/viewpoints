
function processCsv(data) {
  /*
        Given a csv file as a big string blob, parse
        it by interpreting the first line as the title
        line, then the following lines as data rows
        which are comma separated. Return a dictionary
        which contains 'titles' and 'rows" keys.
   */
  var rows = data.split('\n');
  var columns = [];
  var titles = rows.splice(0, 1)[0];
  titles = titles.split(',');

  var enums = titles.map(function() {
    return [];
  });

  // TODO: figure out how to parse files that have a bunch of unique strings.
  // Interning definitely does not work because of all the set math.
  // var maxUnique = 10;
  // var partialLists = [];

  var rowsFinal = [];
  for (let i = 0; i < rows.length;i++) {
    var rowFinal = [];

    var rowSplit = rows[i].split(',');
    for (var j = 0; j < rowSplit.length;j++) {
      var val = rowSplit[j];

      var parsed = parseFloat(val);
      if (isNaN(parsed)) {
        // It was a string. Let's see, is this
        // string already interned?
        var location = enums[j].indexOf(val);
        if (location != -1) {
          val = location;
        }
        else {
          enums[j].push(val);
          val = enums[j].length;
        }
      }
      else {
        val = parsed;
      }
      rowFinal.push(val);
    }
    rowsFinal.push(rowFinal);
  }
  rows = rowsFinal;

  for (let i = 0; i < titles.length; i++) {
    let column = [];
    for (let j = 0; j < rows.length; j++) {
      column.push(rows[j][i]);
    }
    columns.push(column);
  }

  return {
    'titles': titles,
    'columns': columns
  };
}

module.exports = processCsv;
