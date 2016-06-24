var React = require('react');
var Dropdown = require('./dropdown');

var AxesSelector = React.createClass({

  propTypes: {
    onXAxisSelect: React.PropTypes.func,
    onYAxisSelect: React.PropTypes.func,
    options: React.PropTypes.arrayOf(React.PropTypes.string),
    xAxisSelectedIndex: React.PropTypes.number,
    yAxisSelectedIndex: React.PropTypes.number
  },

  render: function() {
    return (
      <div>
        <Dropdown onSelect={this.props.onXAxisSelect}
            options={this.props.options}
            ref="xaxis"
            selectedIndex={this.props.xAxisSelectedIndex}/>
        <span> vs </span>
        <Dropdown onSelect={this.props.onYAxisSelect}
            options={this.props.options}
            ref="yaxis"
            selectedIndex={this.props.yAxisSelectedIndex}/>
      </div>
    );
  }
});

module.exports = AxesSelector;
