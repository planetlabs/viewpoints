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
            options={this.state.options}/>
      </div>);
  }
});

module.exports = App;
