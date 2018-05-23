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
var url = require('url');
var querystring = require('querystring');
var ProgressBar = require('react-progress-bar-plus');

// let urlArgs = url.parse(window.location.href);
// let args = querystring.parse(urlArgs.query);
// if ('csv' in args) {
//   this._parseCsv(args.csv);
// }

class App extends React.Component {
  state = {
    columns: [],
    options: [],
    enums: [],
    loadPercent: 0,
    graphCount: 0,
    pointSize: 2,
    overpaintFactor: 3,
    activeHighlight: 1,
    yellowBrushOverIndex: 0,
    greenBrushOverIndex: 0,
    tealBrushOverIndex: 0,
    purpleBrushOverIndex: 0
  };

  _onUploadChange(event) {
    this._parseCsv(event.target.files[0]);
  };

  _updateProgressBar(percent) {
    this.setState({
      loadPercent: percent,
    });
  };

  _parseCsv(fileOrUrl) {
    var headings = [];
    var columns = [];
    var enums = [];
    let config = {};
    var fileSize = 0;

    if (typeof fileOrUrl == 'string') {
      // it's a url
      config = {
        header: false,
        download: true,
        dynamicTyping: true,
        complete: function(data) {
          headings = data.data.shift();
          let rows = data.data;
          columns = headings.map(function(x) {
            return [];
          });

          for (let i = 0; i < headings.length; i++) {
            for (let j = 0; j < rows.length; j++) {
              columns[i].push(rows[j][i]);
            }
          }

          for (let i = 0; i < columns.length; i++) {
            let newCol = intern(columns[i]);
            columns[i] = newCol.newColumn;
            enums.push(newCol.enums);
          }
          this._onReaderLoad(headings, columns, enums);
        }.bind(this),
        skipEmptyLines: true
      };
    } else {
      fileSize = fileOrUrl.size
      var bigFile = (fileSize > Papa.LocalChunkSize)
      var nChunks = Math.floor(fileSize / (Papa.LocalChunkSize*1.0))
      var iChunk = 0
      var percentDone = 0
      config = {
        header: false,
        dynamicTyping: true,
        chunk: function(dat) {
          if (headings.length === 0) {
            headings = dat.data.shift();

            columns = headings.map(function(x) {
              return [];
            });
          }

          if (bigFile) {
            iChunk += 1;
            percentDone = Math.min(
              100,
              Math.round(iChunk / (1.0 * nChunks) * 100)
            );
            this._updateProgressBar(percentDone)
          }

          var checkpoint_mod = Math.round(dat.data.length / 100)
          for (var j = 0; j < dat.data.length; j++) {
            if (!bigFile) {
              percentDone = Math.round(j / dat.data.length * 100);
              if ((j % checkpoint_mod) == 0) {
                this._updateProgressBar(percentDone)
              }
            }
            for (var i = 0; i < columns.length; i++) {
              columns[i].push(dat.data[j][i]);
            }
          }
        }.bind(this),
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
    }

    Papa.parse(fileOrUrl, config);

  };

  _onReaderLoad(headings, columns, enums) {
    this.setState({
      options: headings,
      columns: columns,
      enums: enums,
      graphCount: 4
    });
  };

  _onAddGraphClick() {
    this.setState({graphCount: this.state.graphCount + 1});
  };

  _onColumnsChanged(newColumns) {
    this.setState({
      columns: newColumns
    });
  };

  _onPointSizeChange(pointSize) {
    this.setState({pointSize: pointSize});
  };

  _onOverpaintFactorChange(factor) {
    this.setState({overpaintFactor: factor});
  };

  _onHighlightChanged(newHighlightKey) {
    newHighlightKey -= 1; // correct for stupid off by 1 behavior
    // that comes with react-bootstrap's implementation of tabs
    this.setState({activeHighlight: newHighlightKey});
  };

  _setYellowBrushOver(index) {
    this.setState({
      yellowBrushOverIndex: parseFloat(index)
    });
  };

  _setTealBrushOver(index) {
    this.setState({
      tealBrushOverIndex: parseFloat(index)
    });
  };

  _setPurpleBrushOver(index) {
    this.setState({
      purpleBrushOverIndex: parseFloat(index)
    });
  };

  _setGreenBrushOver(index) {
    this.setState({
      greenBrushOverIndex: parseFloat(index)
    });
  };

  render() {
    return (
      <div className="vp-app">
        <div className="vp-header">
          <ProgressBar spinner={false} percent={this.state.loadPercent}/>
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
          <Graphs
              activeHighlight={this.state.activeHighlight}
              columns={this.state.columns}
              count={this.state.graphCount}
              enums={this.state.enums}
              onColumnsChanged={this._onColumnsChanged}
              options={this.state.options}
              overpaintFactor={this.state.overpaintFactor}
              yellowBrushOverIndex={this.state.yellowBrushOverIndex}
              greenBrushOverIndex={this.state.greenBrushOverIndex}
              tealBrushOverIndex={this.state.tealBrushOverIndex}
              purpleBrushOverIndex={this.state.purpleBrushOverIndex}
              pointSize={this.state.pointSize}/>
          <Sidebar onPointSizeChange={this._onPointSizeChange}
              activeHighlight={this.state.activeHighlight}
              onHighlightChanged={this._onHighlightChanged}
              overpaintFactor={this.state.overpaintFactor}
              pointSize={this.state.pointSize}
              yellowBrushOverIndex={this.state.yellowBrushOverIndex}
              greenBrushOverIndex={this.state.greenBrushOverIndex}
              tealBrushOverIndex={this.state.tealBrushOverIndex}
              purpleBrushOverIndex={this.state.purpleBrushOverIndex}
              setYellowBrushOver={this._setYellowBrushOver}
              setGreenBrushOver={this._setGreenBrushOver}
              setTealBrushOver={this._setTealBrushOver}
              setPurpleBrushOver={this._setPurpleBrushOver}
              onOverpaintFactorChange={this._onOverpaintFactorChange}/>
        </div>
      </div>);
  };
};

// module.exports = App;
export default App;
