var React = require('react');

var Dropdown = require('./dropdown');
var Viewport = require('./viewport');

var Graph = React.createClass({

  propTypes: {
    axesClassName: React.PropTypes.string,
    className: React.PropTypes.string,
    columns: React.PropTypes.array,
    highlightFunction: React.PropTypes.func,
    highlightedIndicesArrays: React.PropTypes.array,
    normalIndicesArrays: React.PropTypes.array,
    options: React.PropTypes.arrayOf(React.PropTypes.string),
    uid: React.PropTypes.number,
    viewportClassName: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      viewportHeight: 600,
      viewportWidth: 600,
      xAxisSelectedIndex: 0,
      yAxisSelectedIndex: 1
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
        <Viewport
            columns={this.props.columns}
            height={this.state.viewportHeight}
            highlightFunction={this.props.highlightFunction}
            highlightedIndicesArrays={this.props.highlightedIndicesArrays}
            normalIndicesArrays={this.props.normalIndicesArrays}
            options={this.props.options}
            uid={this.props.uid}
            width={this.state.viewportWidth}
            xAxisSelectedIndex={this.state.xAxisSelectedIndex}
            yAxisSelectedIndex={this.state.yAxisSelectedIndex}/>
      </div>
    );
  }
});

module.exports = Graph;
