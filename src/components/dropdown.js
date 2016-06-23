var React = require('react');
var DropdownButton = require('react-bootstrap').DropdownButton;
var MenuItem = require('react-bootstrap').MenuItem;


var Dropdown = React.createClass({
  getInitialState() {
    return {
      options: ["Select Option", "Alpha", "Beta"],
      index: 0
    };
  },
  render() {
    var createMenuItem = function(option) {
        return <MenuItem href="#aef" onClick={this.onclick}>{option}</MenuItem>;
    }.bind(this);

    return (
      <DropdownButton title={this.state.options[this.state.index]}>
        {this.state.options.map(createMenuItem)}
      </DropdownButton>
    );
  },
  onclick: function() {
    console.log("Inner clicked");
  },
});

module.exports = Dropdown;
