// File name: dropdown.js
// Description: small component that handles the dropdown
// selector so you can pick your x and y axes

// Copyright 2016 Planet Labs Inc.

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//   http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
// implied. See the License for the specific language governing permissions and
// limitations under the License.

var React = require('react');
var PropTypes = require('prop-types');
var bootstrap = require('react-bootstrap');
var DropdownButton = bootstrap.DropdownButton;
var MenuItem = bootstrap.MenuItem;
import Typeahead from 'react-bootstrap-typeahead';

class Dropdown extends React.Component {
  _handleChange(elements) {
    if (elements.length > 0) {
      let element = elements[0];
      this.props.onSelect(element.id);
    }
  }

  render() {
    let taOptions = this.props.options.map((option, index) => {
      return {id: index, label: option + ""};
    });

    let selected = [taOptions[this.props.selectedIndex]];

    return (
      <div className="vp-dropdown">
        <Typeahead
            options={taOptions}
            selected={selected}
            onChange={this._handleChange}/>
      </div>
    );
  }

}

Dropdown.propTypes = {
  onSelect: PropTypes.func,
  options: PropTypes.array,
  selectedIndex: PropTypes.number
};

export default Dropdown;
