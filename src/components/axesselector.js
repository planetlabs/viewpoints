var React = require('react');
var Dropdown = require('./dropdown');
var Button = require('react-bootstrap').Button;

var AxesSelector = React.createClass({
  setOptions: function(options, xindex, yindex) {
  	this.refs.xaxis.setState({
  		options: options,
  		index: xindex
  	});
  	this.refs.yaxis.setState({
  		options: options,
  		index: yindex
  	});
  },
  render: function() {
    return (
    	<div>
    		<Dropdown ref="xaxis"></Dropdown> vs <Dropdown ref="yaxis"></Dropdown>
    	</div>);
  },
});

module.exports = AxesSelector;
