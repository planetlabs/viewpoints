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
      pointSize: 2
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
          enums.push(enums);
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
    this.setState({pointSize: pointSize});
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
              onColumnsChanged={this._onColumnsChanged}
              options={this.state.options}
              pointSize={this.state.pointSize}/>
          <Sidebar onPointSizeChange={this._onPointSizeChange}
              pointSize={this.state.pointSize}/>
        </div>
      </div>);
  }
});

module.exports = App;
