var React = require('react');
var ViewpointsGraph = require('./viewpointsgraph');
var processCsv = require('../util/csv');

var App = React.createClass({

  getInitialState() {
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
    this.setState({
      options: parsed.titles,
      columns: parsed.columns,
      graphCount: 1
    });
  },

  _onAddGraphClick: function() {
    this.setState({graphCount: this.state.graphCount + 1});
  },

  render: function() {

    var graphs = [];
    for (var i = 0; i < this.state.graphCount; i++) {
      graphs.push(
        <ViewpointsGraph columns={this.state.columns}
            key={i}
            options={this.state.options}/>
      );
    }

    return (
      <div className="vp-app">
        <div className="vp-upload">
          <span>Upload a new dataset</span>
          <input accept=".csv" onChange={this._onUploadChange} type="file"/>
        </div>
        {this.state.graphCount > 0 && <div className="vp-graphs">
          {graphs}
          <div className="vp-graph" onClick={this._onAddGraphClick}>
            <span>Add a graph</span>
          </div>
        </div>}
      </div>);
  }
});

module.exports = App;
