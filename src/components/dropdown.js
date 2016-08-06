var React = require('react');
var bootstrap = require('react-bootstrap');
var DropdownButton = bootstrap.DropdownButton;
var MenuItem = bootstrap.MenuItem;
import Typeahead from 'react-bootstrap-typeahead';

var Dropdown = React.createClass({
  propTypes: {
    onSelect: React.PropTypes.func,
    options: React.PropTypes.array,
    selectedIndex: React.PropTypes.number
  },

  _handleChange: function(elements) {
    if (elements.length > 0) {
      let element = elements[0];
      this.props.onSelect(element.id);
    }
  },

  render: function() {
    let taOptions = this.props.options.map((option, index) => {
      return {id: index, label: option + ""};
    });

    let selected = [taOptions[this.props.selectedIndex]];

    return (
      <div>
        <Typeahead
            options={taOptions}
            selected={selected}
            onChange={this._handleChange}/>
      </div>
    );
  }
});

module.exports = Dropdown;
