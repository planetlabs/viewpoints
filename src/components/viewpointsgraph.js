var React = require('react');
var AxesSelector = require('./axesselector');
var Viewport = require('./viewport');

var ViewpointsGraph = React.createClass({
  render: function() {
    return (
      <div>
        <Viewport ref="viewport"></Viewport>
        <AxesSelector ref="axes"></AxesSelector>
      </div>);
  },
});

module.exports = ViewpointsGraph;
