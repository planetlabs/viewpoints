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
      console.log('thumbs!');
      this.savedYAxisSelectedIndex = this.state.yAxisSelectedIndex;
      this.setState({
        xAxisSelectedIndex: index,
        yOptions: [1, 4, 9],
        yAxisSelectedIndex: 1,
        thumbnails: true
      });
    }
    else {
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

  render: function() {
    if (this.state.thumbnails) {
      var maxPerArray = 65530;  // TODO: pull this into a global variable
      // It is replicated in viewport.js
      var numThumbs = this.state.yOptions[this.state.yAxisSelectedIndex];
      var urls = [];

      var minimumHighlightedIndices = [];
      for (var i = 0; i < this.props.highlightedIndicesArrays.length; i++) {
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
      // console.log("min highlighted indices", minimumHighlightedIndices);

      for (var i = 0; i < minimumHighlightedIndices.length; i++) {
        var index = minimumHighlightedIndices[i];
        var enumMap = this.props.enums[this.state.xAxisSelectedIndex];
        // console.log("enum map", enumMap.get(index));
        urls.push(enumMap.get(index));
      }

      var mainDisplay = <div className="img-container">
        {urls.map(function(element, index) {
          return (
            <img className="thumb" src={element}/>
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
          <span> vs </span>
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
