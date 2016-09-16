// File name: graph.js
// Description: A single graph component contains just one scatter plot

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

var Dropdown = require('./dropdown');
var Viewport = require('./viewport');

var Graph = React.createClass({

  propTypes: {
    axesClassName: React.PropTypes.string,
    className: React.PropTypes.string,
    columns: React.PropTypes.array,
    enums: React.PropTypes.array,
    highlightFunction: React.PropTypes.func,
    highlightedIndicesArrays: React.PropTypes.array,
    normalIndicesArrays: React.PropTypes.array,
    options: React.PropTypes.arrayOf(React.PropTypes.string),
    overpaintFactor: React.PropTypes.number,
    pointSize: React.PropTypes.number,
    uid: React.PropTypes.number,
    viewportClassName: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      viewportHeight: 600,
      viewportWidth: 600,
      xAxisSelectedIndex: 0,
      yAxisSelectedIndex: 1,
      xOptions: this.props.options,
      yOptions: this.props.options,
      thumbnails: false
    };
  },

  componentDidUpdate(prevProps, prevState) {
    if (prevState.viewportWidth !== this.refs.viewport.offsetWidth ||
        prevState.viewportHeight !== this.refs.viewport.offsetHeight) {

      this.setState({
        viewportHeight: this.refs.viewport.offsetHeight,
        viewportWidth: this.refs.viewport.offsetWidth
      });
    }
  },

  componentDidMount: function() {
    this._onResize();
    window.addEventListener('resize', this._onResize);
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this._onResize);
  },

  _onResize: function() {
    this.setState({
      viewportHeight: this.refs.viewport.offsetHeight,
      viewportWidth: this.refs.viewport.offsetWidth
    });
  },

  _onXAxisSelect: function(index) {
    let newEnumsX = this.props.enums[index];
    let thumbnails = false;
    if (newEnumsX.size > 2) {
      for (var v of newEnumsX.values()) {
        if (v.startsWith('http://') || v.startsWith('www.') || v.startsWith('https://'))
        {
          thumbnails = true;
          break;
        }
      }
    }
    if (thumbnails) {
      this.savedYAxisSelectedIndex = this.state.yAxisSelectedIndex;
      this.setState({
        xAxisSelectedIndex: index,
        yOptions: [
          1, 4, 9, 16
        ],
        yAxisSelectedIndex: 1,
        thumbnails: true
      });
    }
    else {
      this.savedYAxisSelectedIndex = this.state.yAxisSelectedIndex;
      this.setState({
        xAxisSelectedIndex: index,
        yAxisSelectedIndex: this.savedYAxisSelectedIndex,
        yOptions: this.props.options,
        thumbnails: false
      });
    }

  },

  _onYAxisSelect: function(index) {
    this.setState({yAxisSelectedIndex: index});
  },

  _swapAxes: function() {
    let x = this.state.xAxisSelectedIndex;
    let y = this.state.yAxisSelectedIndex;
    this.setState({
      xAxisSelectedIndex: y,
      yAxisSelectedIndex: x
    });
  },

  render: function() {
    if (this.state.thumbnails) {
      var maxPerArray = 65530;  // TODO: pull this into a global variable
      // It is replicated in viewport.js
      var numThumbs = this.state.yOptions[this.state.yAxisSelectedIndex];
      var urls = [];

      var minimumHighlightedIndices = [];
      for (let i = 0; i < this.props.highlightedIndicesArrays.length; i++) {
        var highlightedIndices = this.props.highlightedIndicesArrays[i];
        for (var j = 0; j < highlightedIndices.length; j++) {
          minimumHighlightedIndices.push(highlightedIndices[j] + i * maxPerArray);
          if (minimumHighlightedIndices.length == numThumbs) {
            break
          }
        }
        if (minimumHighlightedIndices.length == numThumbs) {
          break
        }
      }

      for (var i = 0; i < minimumHighlightedIndices.length; i++) {
        var index = minimumHighlightedIndices[i];
        var urlEnumValue = this.props.columns[this.state.xAxisSelectedIndex][index];
        var enumMap = this.props.enums[this.state.xAxisSelectedIndex];
        urls.push(enumMap.get(urlEnumValue));
      }

      var mainDisplay = <div className="img-container">
        {urls.map(function(element, index) {
          return (
            <img key={index} className="thumb" src={element}/>
          );
        })}
      </div>
    }
    else{
      var mainDisplay = (
      <Viewport
          columns={this.props.columns}
          enums={this.props.enums}
          height={this.state.viewportHeight}
          highlightFunction={this.props.highlightFunction}
          highlightedIndicesArrays={this.props.highlightedIndicesArrays}
          normalIndicesArrays={this.props.normalIndicesArrays}
          options={this.props.options}
          overpaintFactor={this.props.overpaintFactor}
          pointSize={this.props.pointSize}
          uid={this.props.uid}
          width={this.state.viewportWidth}
          xAxisSelectedIndex={this.state.xAxisSelectedIndex}
          yAxisSelectedIndex={this.state.yAxisSelectedIndex}/>
      )
    }

    return (
      <div className={this.props.className || 'vp-graph'}>
        <div className={this.props.axesClassName || 'vp-graph-axes'}>
          <Dropdown onSelect={this._onXAxisSelect}
              options={this.state.xOptions}
              ref="xaxis"
              selectedIndex={this.state.xAxisSelectedIndex}/>
          <button className="swap-button" onClick={this._swapAxes}> vs </button>
          <Dropdown onSelect={this._onYAxisSelect}
              options={this.state.yOptions}
              ref="yaxis"
              selectedIndex={this.state.yAxisSelectedIndex}/>
        </div>
        <div className={this.props.viewportClassName || 'vp-graph-viewport'} ref="viewport"/>
        { mainDisplay }
      </div>
    );
  }
});

module.exports = Graph;
