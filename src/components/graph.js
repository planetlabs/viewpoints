var React = require('react');

var Dropdown = require('./dropdown');
var Viewport = require('./viewport');

var Graph = React.createClass({

  propTypes: {
    axesClassName: React.PropTypes.string,
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
        <Viewport columns={this.props.columns}
            options={this.props.options}
            xAxisSelectedIndex={this.state.xAxisSelectedIndex}
            yAxisSelectedIndex={this.state.yAxisSelectedIndex}/>
      </div>
    );
  }
});

module.exports = Graph;
