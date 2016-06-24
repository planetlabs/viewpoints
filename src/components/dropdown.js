var React = require('react');
var DropdownButton = require('react-bootstrap').DropdownButton;
var MenuItem = require('react-bootstrap').MenuItem;


var Dropdown = React.createClass({
  getInitialState() {
    return {
      options: ["Alpha", "Beta", "Gamma"],
      index: 0
    };
  },
  render() {
    var createMenuItem = function(option, ind) {
        return <MenuItem eventKey={option} key={ind} onSelect={this.onselect}>{option}</MenuItem>;
    }.bind(this);

    return (
      <DropdownButton title={this.state.options[this.state.index]}>
        {this.state.options.map(createMenuItem)}
      </DropdownButton>
    );
  },
  onselect: function(eventKey, event) {
    var ind = this.state.options.findIndex(x => x === eventKey);
    this.setState({
        index: ind
    });
  },
});

module.exports = Dropdown;
