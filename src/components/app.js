var React = require('react');
var ViewpointsGraph = require('./viewpointsgraph');
var processCsv = require('../util/csv');

var App = React.createClass({

  getInitialState() {
    return {
      columns: [],
      options: [],
      graphCount: 1
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
        {this.state.options.length > 0 && Array.apply(null, Array(this.state.graphCount)).map((item, index) => {
          return (
            <ViewpointsGraph columns={this.state.columns}
                key={index}
                options={this.state.options}/>
          );
        })}
        <input accept=".csv" onChange={this._onUploadChange} type="file"/>
      </div>);
  }
});

module.exports = App;
