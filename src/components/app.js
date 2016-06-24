var React = require('react');
var ViewpointsGraph = require('./viewpointsgraph');

var App = React.createClass({
  render: function() {
    return (
      <div>
        <ViewpointsGraph ref="viewport"></ViewpointsGraph>
      </div>);
  },
});

module.exports = App;
