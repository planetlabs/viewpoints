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
var ButtonGroup = bootstrap.ButtonGroup;
var Glyphicon = bootstrap.Glyphicon;

var Sidebar = React.createClass({

  propTypes: {
    onPointSizeChange: React.PropTypes.func,
    overpaintFactor: React.PropTypes.number,
    onOverpaintFactorChange: React.PropTypes.func,
    pointSize: React.PropTypes.number,
    activeHighlight: React.PropTypes.number,
    onHighlightChanged: React.PropTypes.func,
    yellowBrushOverIndex: React.PropTypes.number,
    greenBrushOverIndex: React.PropTypes.number,
    tealBrushOverIndex: React.PropTypes.number,
    PurpleBrushOverIndex: React.PropTypes.number,
    setYellowBrushOver: React.PropTypes.func,
    setGreenBrushOver: React.PropTypes.func,
    setTealBrushOver: React.PropTypes.func,
    setPurpleBrushOver: React.PropTypes.func
  },

  _onPointSizeChange: function(event) {
    this.props.onPointSizeChange(parseFloat(event.target.value));
  },

  _onOverpaintFactorChange: function(event) {
    this.props.onOverpaintFactorChange(parseFloat(event.target.value));
  },

  _setYellowBrushOverIndex: function(index) {
    this.props.setYellowBrushOver(index);
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

    var redGlyph = (<Glyphicon glyph="tint" className='red' value='0'/>);
    var blueGlyph = (<Glyphicon glyph="tint" className='blue' value='1'/>);
    var greenGlyph = (<Glyphicon glyph="tint" className='green' value='2'/>);
    var yellowGlyph = (<Glyphicon glyph="tint" className='yellow' value='3'/>);
    var tealGlyph = (<Glyphicon glyph="tint" className='teal' value='4'/>);
    var purpleGlyph = (<Glyphicon glyph="tint" className='purple' value='5'/>);

    var redInside = (
      <div>
        <div className="vp-sidebar-item-label">Select From</div>
        <ButtonGroup>
          <Button disabled>{redGlyph}</Button>
          <Button disabled>{blueGlyph}</Button>
          <Button disabled>{greenGlyph}</Button>
          <Button disabled>{yellowGlyph}</Button>
          <Button disabled>{tealGlyph}</Button>
          <Button disabled>{purpleGlyph}</Button>
        </ButtonGroup>
      </div>
    )

    var blueInside = (
      <div>
        <div className="vp-sidebar-item-label">Select From</div>
        <ButtonGroup>
          <Button disabled>{redGlyph}</Button>
          <Button disabled>{blueGlyph}</Button>
          <Button disabled>{greenGlyph}</Button>
          <Button disabled>{yellowGlyph}</Button>
          <Button disabled>{tealGlyph}</Button>
          <Button disabled>{purpleGlyph}</Button>
        </ButtonGroup>
      </div>
    )

    var greenInside = (
      <div>
        <div className="vp-sidebar-item-label">Select From</div>
        <ButtonGroup>
          <Button value='0' onClick={() => this.props.setGreenBrushOver('0')}>{redGlyph}</Button>
          <Button value='1' onClick={() => this.props.setGreenBrushOver('1')}>{blueGlyph}</Button>
          <Button disabled>{greenGlyph}</Button>
          <Button disabled>{yellowGlyph}</Button>
          <Button disabled>{tealGlyph}</Button>
          <Button disabled>{purpleGlyph}</Button>
        </ButtonGroup>
      </div>
    )

    var yellowInside = (
      <div>
        <div className="vp-sidebar-item-label">Select From</div>
        <ButtonGroup>
          <Button value='0' onClick={() => this.props.setYellowBrushOver('0')}>{redGlyph}</Button>
          <Button value='1' onClick={() => this.props.setYellowBrushOver('1')}>{blueGlyph}</Button>
          <Button value='2' onClick={() => this.props.setYellowBrushOver('2')}>{greenGlyph}</Button>
          <Button disabled>{yellowGlyph}</Button>
          <Button disabled>{tealGlyph}</Button>
          <Button disabled>{purpleGlyph}</Button>
        </ButtonGroup>
      </div>
    )

    var tealInside = (
      <div>
        <div className="vp-sidebar-item-label">Select From</div>
        <ButtonGroup>
          <Button value='0' onClick={() => this.props.setTealBrushOver('0')}>{redGlyph}</Button>
          <Button value='1' onClick={() => this.props.setTealBrushOver('1')}>{blueGlyph}</Button>
          <Button value='2' onClick={() => this.props.setTealBrushOver('2')}>{greenGlyph}</Button>
          <Button value='3' onClick={() => this.props.setTealBrushOver('3')}>{yellowGlyph}</Button>
          <Button disabled>{tealGlyph}</Button>
          <Button disabled>{purpleGlyph}</Button>
        </ButtonGroup>
      </div>
    )

    var purpleInside = (
      <div>
        <div className="vp-sidebar-item-label">Select From</div>
        <ButtonGroup>
          <Button value='0' onClick={() => this.props.setPurpleBrushOver('0')}>{redGlyph}</Button>
          <Button value='1' onClick={() => this.props.setPurpleBrushOver('1')}>{blueGlyph}</Button>
          <Button value='2' onClick={() => this.props.setPurpleBrushOver('2')}>{greenGlyph}</Button>
          <Button value='3' onClick={() => this.props.setPurpleBrushOver('3')}>{yellowGlyph}</Button>
          <Button value='4' onClick={() => this.props.setPurpleBrushOver('4')}>{tealGlyph}</Button>
          <Button disabled>{purpleGlyph}</Button>
         </ButtonGroup>
      </div>
    )


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
          <Tabs activeKey={this.props.activeHighlight+1} onSelect={this.props.onHighlightChanged} id="controlled-tab">
            <Tab eventKey={1} title={redGlyph}>{redInside}</Tab>
            <Tab eventKey={2} title={blueGlyph}>{greenInside}</Tab>
            <Tab eventKey={3} title={greenGlyph}>{greenInside}</Tab>
            <Tab eventKey={4} title={yellowGlyph}>{yellowInside}</Tab>
            <Tab eventKey={5} title={tealGlyph}>{tealInside}</Tab>
            <Tab eventKey={6} title={purpleGlyph}>{purpleInside}</Tab>
          </Tabs>
        </div>
      </div>
    );
  }
});

module.exports = Sidebar;
