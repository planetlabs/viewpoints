function rowsToColumns(rows) {
  var cols = rows[0].map(function() {
    return new Map();
  });
}


var headings = [];
var isNumeric = [];
var columns = [];

function parseFile(file, callback) {
  var fileSize   = file.size;
  var chunkSize  = 1 * 1024 * 1024; // bytes
  var offset     = 0;
  var self       = this; // we need a reference to the current object
  var chunkReaderBlock = null;
  var residual = "";
  // var accumulator = "";

  var readEventHandler = function(evt) {
    // console.log("in read event handler");
    if (evt.target.error == null) {
      // console.log("no error");
      offset += evt.target.result.length;
      // accumulator += evt.target.result;
      residual = processCsv(residual + evt.target.result);
      // callback(evt.target.result); // callback for handling read chunk
    } else {
      console.log("Read error: " + evt.target.error);
      return;
    }
    if (offset >= fileSize) {
      console.log("Done reading file");
      // console.log(accumulator.length);
      callback(headings, columns);
      return;
    }

    // of to the next chunk
    chunkReaderBlock(offset, chunkSize, file);
  }

  chunkReaderBlock = function(_offset, length, _file) {
    var r = new FileReader();
    var blob = _file.slice(_offset, length + _offset);
    r.onload = readEventHandler;
    r.readAsText(blob);
  }

  // now let's start the read with the first block
  chunkReaderBlock(offset, chunkSize, file);
}

function processCsv(data) {
  if (headings.length === 0) {
    // console.log("initializing the headings");
    var firstNewlineLocation = data.indexOf('\n');
    var headingsLine = data.slice(0, firstNewlineLocation);
    headings = headingsLine.split(',');
    console.log("headings", headings);
    var data = data.slice(firstNewlineLocation+1);

    var typesLine = data.slice(0, data.indexOf('\n'));
    var typesArray = typesLine.split(',');
    console.log("types array", typesArray);

    for (var i = 0; i < typesArray.length; i++) {
      var parsed = parseFloat(typesArray[i]);
      if (isNaN(parsed)) {
        var isFloat = false;
      }
      else {
        var isFloat = true;
      }
      isNumeric.push(isFloat);
    }
    console.log("is numeric", isNumeric);
  }
  else {
    console.log("processing the csv incrementally");
    var startIndex = 0;
    var stopIndex = data.indexOf('\n', startIndex);
    while (true) {
      var line = data.slice(startIndex, stopIndex);
      startIndex = stopIndex;
      stopIndex = data.indexOf('\n', stopIndex + 1);

      var lineSplit = line.split(',');
      if (lineSplit.length !== headings.length) {
        console.log("WHOA, NOT EQUAL IN LENGTH");
        console.log(lineSplit.length, "vs", headings.length);
      }

      if (stopIndex === -1) {
        break;
      }
    }

    var residual = data.slice(startIndex);
    console.log("residual", residual, '\n');

    // find the number of good lines we have and read/parse them and accumulate them
    // any extra chars? send those back
    // console.log("calling processCSV with data", data.length);
  }
  return residual;
}


function processCsv2(data) {
  console.log("Raw data length:", data.length);
  var start = new Date().getTime();
  /*
        Given a csv file as a big string blob, parse
        it by interpreting the first line as the title
        line, then the following lines as data rows
        which are comma separated. Return a dictionary
        which contains 'titles' and 'rows' keys.
   */
  data = data.trim();
  console.log("after trim");

  var rows = data.split('\n');
  console.log("rows length:", rows.length);
  if (rows.length === 1) {
    console.log(rows);
  }
  var columns = [];
  var titles = rows.splice(0, 1)[0];
  titles = titles.split(',');

  var enums = titles.map(function() {
    return new Map();
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
        var location = enums[j].get(val);
        if (typeof location !== 'undefined') {
          val = location;
        }
        else {
          var proxyVal = enums[j].size;
          enums[j].set(val, proxyVal);
          val = proxyVal;
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

  var end = new Date().getTime();
  var time = end - start;
  console.log("csv parse took: ", time);
  return {
    'titles': titles,
    'columns': columns
  };
}

module.exports = rowsToColumns;
