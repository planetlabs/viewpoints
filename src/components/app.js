var React = require('react');

var Graphs = require('./graphs');

// var rowsToColumns = require('../util/csv');

var Papa = require('papaparse');

var App = React.createClass({

  getInitialState: function() {
    return {
      columns: [],
      options: [],
      graphCount: 0
    };
  },

  _onUploadChange: function(event) {
    var start = new Date().getTime();

    var headings = [];
    var columns = [];

    var config = {
      header: false,
      dynamicTyping: true,
      chunk: function(dat) {
        if (headings.length === 0) {
          headings = dat.data.shift();
          console.log("grabbed headings");
          console.log(headings);

          columns = headings.map(function(x) {
            return [];
          });
        }

        for (var j = 0; j < dat.data.length; j++) {
          for (var i = 0; i < columns.length; i++) {
            columns[i].push(dat.data[j][i]);
          }
        }

        var end = new Date().getTime();
        var time = end - start;
        console.log("csv parse took: ", time);
      },
      complete: function() {
        console.log("read in ", columns[0].length);
        this._onReaderLoad(headings, columns);
      }.bind(this),
      skipEmptyLines: true,
    };

    Papa.parse(event.target.files[0], config);
  },

  _onReaderLoad: function(headings, columns) {
    this.setState({
      options: headings,
      columns: columns,
      graphCount: 1
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
            onColumnsChanged={this._onColumnsChanged}/>
      </div>);
  }
});

module.exports = App;
