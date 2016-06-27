var React = require('react');

var Graphs = require('./graphs');

var processCsv = require('../util/csv');

function unselectAll(columnLength) {
  var normalIndices = [];
  var highlightedIndices = [];
  var normalIndicesArrays = [];
  var highlightedIndicesArrays = [];
  var maxPerArray = 65530;

  var i = 0;

  while (i < columnLength) {
    normalIndices.push(i % maxPerArray);

    i++;

    if (i % maxPerArray === 0 || i === columnLength) {
        normalIndicesArrays.push(normalIndices);
        normalIndices = [];

        highlightedIndicesArrays.push(highlightedIndices);
        highlightedIndices = [];
    }
  }
  return [normalIndicesArrays, highlightedIndicesArrays];
}


var App = React.createClass({

  getInitialState: function() {
    return {
      columns: [],
      options: [],
      graphCount: 0
    };
  },

  // getInitialState() {
  //   return {
  //     columns: [[1, 1, 2, 3], [3, 4, 5, 1], [1, 2, 1, 2]],
  //     options: ["Alpha", "Beta", "Gamma"],
  //     graphCount: 1
  //   };
  // },

  _onUploadChange: function(event) {
    var reader = new FileReader();
    reader.onload = this._onReaderLoad;
    reader.readAsText(event.target.files[0]);
  },

  _onReaderLoad: function(event) {
    // TODO: parse the csv
    var parsed = processCsv(event.target.result);
    console.log('parsed:', parsed);

    var indicesArrays = unselectAll(parsed.columns[0].length);

    this.setState({
      options: parsed.titles,
      columns: parsed.columns,
      graphCount: 1,
      normalIndicesArrays: indicesArrays[0],
      highlightedIndicesArrays: indicesArrays[1]
    });
  },

  _onAddGraphClick: function() {
    this.setState({graphCount: this.state.graphCount + 1});
  },

  _findSelectedIndices: function(ptArrays, xDown, xUp, yDown, yUp) {
    var xMin = Math.min(xDown, xUp);
    var xMax = Math.max(xDown, xUp);

    var yMin = Math.min(yDown, yUp);
    var yMax = Math.max(yDown, yUp);

    var normalIndicesArrays = [];
    var highlightedIndicesArrays = [];

    var nCounts = 0;
    var hCounts = 0;

    for (var i = 0; i < ptArrays.length; i++) {
      var pts = ptArrays[i];
      var normalIndices = [];
      var highlightedIndices = [];

      for (var j = 0; j < pts.length; j+=2) {
        var x = pts[j];
        var y = pts[j+1];

        if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
          highlightedIndices.push(j/2);
          hCounts++;
        }
        else {
          normalIndices.push(j/2);
          nCounts++;
        }
      }

      normalIndicesArrays.push(normalIndices);
      highlightedIndicesArrays.push(highlightedIndices);
    }

    this.setState({
      normalIndicesArrays: normalIndicesArrays,
      highlightedIndicesArrays: highlightedIndicesArrays
    });
  },

  render: function() {
    return (
      <div className="vp-app">
        <div className="vp-header">
          <div className="vp-header-item vp-upload">
            <span>Upload a new dataset</span>
            <input accept=".csv" onChange={this._onUploadChange} type="file"/>
          </div>
          {this.state.graphCount > 0 && <div className="vp-header-item"
              onClick={this._onAddGraphClick}>
            Add graph
          </div>}
        </div>
        <Graphs columns={this.state.columns}
            count={this.state.graphCount}
            options={this.state.options}
            highlightFunction={this._findSelectedIndices}
            normalIndicesArrays={this.state.normalIndicesArrays}
            highlightedIndicesArrays={this.state.highlightedIndicesArrays}/>
      </div>);
  }
});

module.exports = App;
