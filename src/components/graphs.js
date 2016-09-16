// File name: graphs.js
// Description: the graphs component contains n graph components and
// keeps them linked together. The highlighted points state is
// managed here.

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

var React = require('react');
var Graph = require('./graph');
var maxPerArray = 65530;

function unselectAll(columnLength) {
  var normalIndices = [];
  var highlightedIndices = [];
  var normalIndicesArrays = [];
  var highlightedIndicesArrays = [];

  var i = 0;

  while (i < columnLength) {
    normalIndices.push(i % maxPerArray);

    i++;

    if (i % maxPerArray === 0 || i === columnLength) {
      normalIndicesArrays.push(new Uint16Array(normalIndices));
      normalIndices = [];

      highlightedIndicesArrays.push(new Uint16Array(highlightedIndices));
      highlightedIndices = [];
    }
  }
  return [normalIndicesArrays, highlightedIndicesArrays];
}

var Graphs = React.createClass({

  propTypes: {
    axesClassName: React.PropTypes.string,
    className: React.PropTypes.string,
    columns: React.PropTypes.array,
    count: React.PropTypes.number,
    enums: React.PropTypes.array,
    graphClassName: React.PropTypes.string,
    highlightFunction: React.PropTypes.func,
    onColumnsChanged: React.PropTypes.func,
    options: React.PropTypes.arrayOf(React.PropTypes.string),
    overpaintFactor: React.PropTypes.number,
    pointSize: React.PropTypes.number,
    rowClassName: React.PropTypes.string,
    viewportClassName: React.PropTypes.string
  },

  getInitialState() {
    return {
      highlightedIndicesArrays: [],
      normalIndicesArrays: []
    };
  },

  componentDidMount() {
    window.addEventListener('keydown', this._keydown);
    window.addEventListener('keyup', this._keyup);
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.state.normalIndicesArrays.length === 0) {
      if (this.props.columns.length > 0) {
        var indicesArrays = unselectAll(this.props.columns[0].length);
        this.setState({
          normalIndicesArrays: indicesArrays[0],
          highlightedIndicesArrays: indicesArrays[1]
        });
      }
    }
  },

  _keydown: function(event) {
    switch (event.which) {
      case 73: // 'i' key: invert
        this.setState({
          highlightedIndicesArrays: this.state.normalIndicesArrays,
          normalIndicesArrays: this.state.highlightedIndicesArrays
        });
        break;
      case 88: // 'x' key: delete
        this._deleteHighlighted();
        break;

      default:
        break;
    }
  },

  _keyup: function(event) {
    switch (event.which) {

      default:
        break;
    }
  },

  _deleteHighlighted: function() {
    var totalHighlighted = 0;
    for (var a = 0; a < this.state.highlightedIndicesArrays.length; a++) {
      var highlightedIndices = this.state.highlightedIndicesArrays[a];
      totalHighlighted += highlightedIndices.length;
    }

    var newColumns = [];
    for (var c = 0; c < this.props.columns.length; c++) {
      var oldColumn = this.props.columns[c];
      var newColumn = [];
      for (var i = 0; i < this.state.normalIndicesArrays.length; i++) {
        var normalIndices = this.state.normalIndicesArrays[i];

        for (var j = 0; j < normalIndices.length; j++) {
          newColumn.push(oldColumn[normalIndices[j] + i * maxPerArray]);
        }
      }
      newColumns.push(newColumn);
    }

    var newIndices = unselectAll(newColumns[0].length);

    this.props.onColumnsChanged(newColumns);
    this.setState({
      normalIndicesArrays: newIndices[0],
      highlightedIndicesArrays: newIndices[1]
    })
  },

  _findSelectedIndices: function(ptArrays, xDown, xUp, yDown, yUp) {
    // console.log('finding highlighted');
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

      for (var j = 0; j < pts.length; j += 2) {
        var x = pts[j];
        var y = pts[j + 1];

        if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
          highlightedIndices.push(j / 2);
          hCounts++;
        }
        else {
          normalIndices.push(j / 2);
          nCounts++;
        }
      }

      normalIndicesArrays.push(new Uint16Array(normalIndices));
      highlightedIndicesArrays.push(new Uint16Array(highlightedIndices));

    }

    this.setState({
      normalIndicesArrays: normalIndicesArrays,
      highlightedIndicesArrays: highlightedIndicesArrays
    });
  },

  render: function() {

    if (!this.props.columns || !this.props.options) {
      return null;
    }

    var rows = [];
    for (var i = 0; i < this.props.count; i++) {
      var rowIndex = this.props.count > 2 ?
          Math.round(i / this.props.count) : 0;
      if (!rows[rowIndex]) {
        rows[rowIndex] = [];
      }
      rows[rowIndex].push(
        <Graph
            axesClassName={this.props.axesClassName}
            className={this.props.graphClassName}
            columns={this.props.columns}
            enums={this.props.enums}
            highlightFunction={this._findSelectedIndices}
            highlightedIndicesArrays={this.state.highlightedIndicesArrays}
            key={i}
            normalIndicesArrays={this.state.normalIndicesArrays}
            options={this.props.options}
            overpaintFactor={this.props.overpaintFactor}
            pointSize={this.props.pointSize}
            uid={i}/>
      );
    }

    return (
      <div className={this.props.className || 'vp-graphs'}>
        {rows.map((graphs, index) => {
          return (
            <div className={this.props.rowClassName || 'vp-graphs-row'}
                key={index}>
              {graphs}
            </div>
          );
        })}
      </div>
    );
  }
});

module.exports = Graphs;
