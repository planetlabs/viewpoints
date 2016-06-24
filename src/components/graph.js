var React = require('react');
var AxesSelector = require('./axesselector');
var Viewport = require('./viewport');

var Graph = React.createClass({

  propTypes: {
    className: React.PropTypes.string,
    columns: React.PropTypes.array,
    options: React.PropTypes.arrayOf(React.PropTypes.string)
  },

  getInitialState: function() {
    return {
      xAxisSelectedIndex: 0,
      yAxisSelectedIndex: 1
    };
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
        <Viewport/>
        <AxesSelector onXAxisSelect={this._onXAxisSelect}
            onYAxisSelect={this._onYAxisSelect}
            options={this.props.options}
            xAxisSelectedIndex={this.state.xAxisSelectedIndex}
            yAxisSelectedIndex={this.state.yAxisSelectedIndex}/>
      </div>
    );
  }
});

module.exports = Graph;