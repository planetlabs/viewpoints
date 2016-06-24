var React = require('react');
var bootstrap = require('react-bootstrap');
var DropdownButton = bootstrap.DropdownButton;
var MenuItem = bootstrap.MenuItem;


var Dropdown = React.createClass({

  propTypes: {
    onSelect: React.PropTypes.func,
    options: React.PropTypes.array,
    selectedIndex: React.PropTypes.number
  },

  render: function() {
    return (
      <DropdownButton title={this.props.options[this.props.selectedIndex]}>
        {this.props.options.map((option, index) => {
          return (
            <MenuItem active={index === this.props.selectedIndex}
                key={index}
                onSelect={this.props.onSelect.bind(null, index)}>
              {option}
            </MenuItem>
          );
        })}
      </DropdownButton>
    );
  }
});

module.exports = Dropdown;
