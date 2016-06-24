var React = require('react');
var ViewpointsGraph = require('./viewpointsgraph');

var App = React.createClass({

  _onUploadChange: function(event) {
    var reader = new FileReader();
    reader.onload = this._onReaderLoad;
    reader.readAsText(event.target.files[0]);
  },

  _onReaderLoad: function(event) {
    // TODO: parse the csv
    // var data = parseData(event.target.result);
    // this.setState({data: data});
  },

  render: function() {
    return (
      <div>
        <ViewpointsGraph options={['Alpha', 'Beta', 'Gamma']}/>
        <input accept=".csv" onChange={this._onUploadChange} type="file"/>
      </div>);
  }
});

module.exports = App;
