var React = require('react');

var Graphs = require('./graphs');

var processCsv = require('../util/csv');

var App = React.createClass({

  getInitialState: function() {
    return {
      columns: [],
      options: [],
      graphCount: 0
    };
  },

  _onUploadChange: function(event) {
    var reader = new FileReader();
    reader.onload = this._onReaderLoad;
    reader.readAsText(event.target.files[0]);
  },

  _onReaderLoad: function(event) {
    var parsed = processCsv(event.target.result);
    console.log('parsed.');

    this.setState({
      options: parsed.titles,
      columns: parsed.columns,
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
