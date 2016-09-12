// File name: app.js
// Description: Top level component that contains the entire app

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
var Graphs = require('./graphs');
var Sidebar = require('./sidebar');
var intern = require('../util/csv');
var Papa = require('papaparse');

var App = React.createClass({

  getInitialState: function() {
    return {
      columns: [],
      options: [],
      enums: [],
      graphCount: 0,
      pointSize: 2,
      overpaintFactor: 3
    };
  },

  _onUploadChange: function(event) {

    var headings = [];
    var columns = [];
    var enums = [];

    var config = {
      header: false,
      dynamicTyping: true,
      chunk: function(dat) {
        if (headings.length === 0) {
          headings = dat.data.shift();

          columns = headings.map(function(x) {
            return [];
          });
        }

        for (var j = 0; j < dat.data.length; j++) {
          for (var i = 0; i < columns.length; i++) {
            columns[i].push(dat.data[j][i]);
          }
        }
      },
      complete: function() {
        for (var i = 0; i < columns.length; i++) {
          var newCol = intern(columns[i]);
          columns[i] = newCol.newColumn;
          enums.push(newCol.enums);
        }

        this._onReaderLoad(headings, columns, enums);
      }.bind(this),
      skipEmptyLines: true
    };

    Papa.parse(event.target.files[0], config);
  },

  _onReaderLoad: function(headings, columns, enums) {
    this.setState({
      options: headings,
      columns: columns,
      enums: enums,
      graphCount: 4
    });
  },

  _onAddGraphClick: function() {
    this.setState({graphCount: this.state.graphCount + 1});
  },

  _onColumnsChanged: function(newColumns) {
    this.setState({
      columns: newColumns
    });
  },

  _onPointSizeChange: function(pointSize) {
    // console.log("on point size change");
    this.setState({pointSize: pointSize});
  },

  _onOverpaintFactorChange: function(factor) {
    // console.log("on overpaint change");
    this.setState({overpaintFactor: factor});
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
        <div className="vp-content">
          <Graphs columns={this.state.columns}
              count={this.state.graphCount}
              enums={this.state.enums}
              onColumnsChanged={this._onColumnsChanged}
              options={this.state.options}
              overpaintFactor={this.state.overpaintFactor}
              pointSize={this.state.pointSize}/>
          <Sidebar onPointSizeChange={this._onPointSizeChange}
              pointSize={this.state.pointSize}
              overpaintFactor={this.state.overpaintFactor}
              onOverpaintFactorChange={this._onOverpaintFactorChange}/>
        </div>
      </div>);
  }
});

module.exports = App;
