var React = require('react');
var Dropdown = require('./dropdown');
var Button = require('react-bootstrap').Button;

var App = React.createClass({
  onclick: function() {
  	console.log("CLICKED DO STUFF");
  	console.log(this.dd0);
  	this.dd0.setState({
  		options: ["zero", "one", "two", "three"],
  		index: 2
  	});
  },
  render: function() {
  	this.dd0 = <Dropdown></Dropdown>
  	this.dd1 = <Dropdown></Dropdown>
    return (
    	<div>
    		{this.dd1} vs {this.dd0}
    		<Button onClick={this.onclick}>Do Stuff</Button>
    	</div>);
  },
});

module.exports = App;
