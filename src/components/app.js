var React = require('react');
var AxesSelector = require('./axesselector');

var App = React.createClass({
  render: function() {
    return (
      <div>
        <AxesSelector ref="axes"></AxesSelector>
      </div>);
  },
});

module.exports = App;
