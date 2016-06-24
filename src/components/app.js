var React = require('react');
var ViewpointsGraph = require('./viewpointsgraph');
var processCsv = require('../util/csv');

var App = React.createClass({

  getInitialState() {
    return {
      options: ["A", "B", "C"]
    };
  },

  _onUploadChange: function(event) {
    var reader = new FileReader();
    reader.onload = this._onReaderLoad;
    reader.readAsText(event.target.files[0]);
  },

  _onReaderLoad: function(event) {
    // TODO: parse the csv
    var parsed = processCsv(event.target.result);
    console.log("parsed:", parsed);
    this.setState({
      options: parsed.titles,
      columns: parsed.columns
    });
  },

  render: function() {
    return (
      <div>
        <ViewpointsGraph options={this.state.options}/>
        <input accept=".csv" onChange={this._onUploadChange} type="file"/>
      </div>);
  }
});

module.exports = App;
