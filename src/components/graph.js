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
var PropTypes = require('prop-types');

class Graph extends React.Component {
  state =  {
    viewportHeight: 600,
    viewportWidth: 600,
    xAxisSelectedIndex: 0,
    yAxisSelectedIndex: 1,
    xOptions: this.props.options,
    yOptions: this.props.options,
    thumbnails: false
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.viewportWidth !== this.refs.viewport.offsetWidth ||
        prevState.viewportHeight !== this.refs.viewport.offsetHeight) {

      this.setState({
        viewportHeight: this.refs.viewport.offsetHeight,
        viewportWidth: this.refs.viewport.offsetWidth
      });
    }
  };

  componentDidMount() {
    this._onResize();
    window.addEventListener('resize', this._onResize);
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize);
  };

  _onResize() {
    this.setState({
      viewportHeight: this.refs.viewport.offsetHeight,
      viewportWidth: this.refs.viewport.offsetWidth
    });
  };

  _onXAxisSelect(index) {
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

  };

  _onYAxisSelect(index) {
    this.setState({yAxisSelectedIndex: index});
  };

  _swapAxes() {
    let x = this.state.xAxisSelectedIndex;
    let y = this.state.yAxisSelectedIndex;
    this.setState({
      xAxisSelectedIndex: y,
      yAxisSelectedIndex: x
    });
  };

  render() {
    if (this.state.thumbnails) {
      var maxPerArray = 65530;  // TODO: pull this into a global variable
      // It is replicated in viewport.js
      var numThumbs = this.state.yOptions[this.state.yAxisSelectedIndex];
      var urls = [];

      var minimumHighlightedIndices = [];
      for (let b = 0; b < this.props.brushes.length; b++) {
        for (let i = 0; i < this.props.brushes[b].length; i++) {
          var highlightedIndices = this.props.brushes[b][i];
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
          brushes={this.props.brushes}
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
  };
};

Graph.propTypes = {
  axesClassName: PropTypes.string,
  brushes: PropTypes.array,
  className: PropTypes.string,
  columns: PropTypes.array,
  enums: PropTypes.array,
  highlightFunction: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.string),
  overpaintFactor: PropTypes.number,
  pointSize: PropTypes.number,
  uid: PropTypes.number,
  viewportClassName: PropTypes.string
};

// module.exports = Graph;
export default Graph;
