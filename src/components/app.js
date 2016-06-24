var React = require('react');
var ViewpointsGraph = require('./viewpointsgraph');

var App = React.createClass({
  render: function() {
    return (
      <div>
        <ViewpointsGraph options={['Alpha', 'Beta', 'Gamma']}/>
      </div>);
  }
});

module.exports = App;
