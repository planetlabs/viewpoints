var React = require('react');

var Dropdown = require('./dropdown');
var Viewport = require('./viewport');

var Graph = React.createClass({

  propTypes: {
    axesClassName: React.PropTypes.string,
    className: React.PropTypes.string,
    columns: React.PropTypes.array,
    options: React.PropTypes.arrayOf(React.PropTypes.string),
    highlightFunction: React.PropTypes.func,
    viewportClassName: React.PropTypes.string,
    normalIndicesArrays: React.PropTypes.array,
    highlightedIndicesArrays: React.PropTypes.array
  },

  getInitialState: function() {
    return {
      viewportHeight: 600,
      viewportWidth: 600,
      xAxisSelectedIndex: 0,
      yAxisSelectedIndex: 1
    };
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
    this.setState({xAxisSelectedIndex: index});
  },

  _onYAxisSelect: function(index) {
    this.setState({yAxisSelectedIndex: index});
  },

  render: function() {
    return (
      <div className={this.props.className || 'vp-graph'}>
        <div className={this.props.axesClassName || 'vp-graph-axes'}>
          <Dropdown onSelect={this._onXAxisSelect}
              options={this.props.options}
              ref="xaxis"
              selectedIndex={this.state.xAxisSelectedIndex}/>
          <span> vs </span>
          <Dropdown onSelect={this._onYAxisSelect}
              options={this.props.options}
              ref="yaxis"
              selectedIndex={this.state.yAxisSelectedIndex}/>
        </div>
        <div className={this.props.viewportClassName || 'vp-graph-viewport'} ref="viewport"/>
        <Viewport columns={this.props.columns}
            height={this.state.viewportHeight}
            options={this.props.options}
            width={this.state.viewportWidth}
            highlightFunction={this.props.highlightFunction}
            normalIndicesArrays={this.props.normalIndicesArrays}
            highlightedIndicesArrays={this.props.highlightedIndicesArrays}
            xAxisSelectedIndex={this.state.xAxisSelectedIndex}
            yAxisSelectedIndex={this.state.yAxisSelectedIndex}/>
      </div>
    );
  }
});

module.exports = Graph;
