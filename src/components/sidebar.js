// File name: sidebar.js
// Description: The sidebar component manages the sidebar.
// On the sidebar are various inputs like point size and overpaint
// factor.

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
var bootstrap = require('react-bootstrap');
var Tabs = bootstrap.Tabs;
var Tab = bootstrap.Tab;
var Button = bootstrap.Button;
var Glyphicon = bootstrap.Glyphicon;

var Sidebar = React.createClass({

  propTypes: {
    onPointSizeChange: React.PropTypes.func,
    overpaintFactor: React.PropTypes.number,
    onOverpaintFactorChange: React.PropTypes.func,
    pointSize: React.PropTypes.number,
  },

  _onPointSizeChange: function(event) {
    this.props.onPointSizeChange(parseFloat(event.target.value));
  },

  _onOverpaintFactorChange: function(event) {
    this.props.onOverpaintFactorChange(parseFloat(event.target.value));
  },

  render: function() {

    var items = [
      {
        label: 'Point Size',
        value: this.props.pointSize,
        input: (
          <input max="10"
              min="0.5"
              onChange={this._onPointSizeChange}
              step="0.1"
              type="range"
              value={this.props.pointSize}/>
        )
      },
      {
        label: 'Overpaint Factor',
        value: this.props.overpaintFactor,
        input: (
          <input max="100"
              min="0"
              onChange={this._onOverpaintFactorChange}
              step="1"
              type="range"
              value={this.props.overpaintFactor}/>
        )
      }
    ];

    return (
      <div className="vp-sidebar">
        {items.map(function(item, index) {
          return (
            <div className="vp-sidebar-item" key={index}>
              <div className="vp-sidebar-item-value">{item.value}</div>
              <div className="vp-sidebar-item-label">{item.label}</div>
              {item.input}
            </div>
          )
        })}
        <div>
          <Tabs defaultActiveKey={2} id="uncontrolled-tab-example">
            <Tab eventKey={1} title="Red"></Tab>
            <Tab eventKey={2} title="Blue">Tab 2 content</Tab>
            <Tab eventKey={3} title="Yellow">Tab 3 content</Tab>
            <Tab eventKey={4} title="Green">Tab 3 content</Tab>
          </Tabs>
        </div>
      </div>
    );
  }
});

module.exports = Sidebar;
