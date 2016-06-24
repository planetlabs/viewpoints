var React = require('react');

var ViewpointsGraph = require('./graph');

var Graphs = React.createClass({

  propTypes: {
    className: React.PropTypes.string,
    columns: React.PropTypes.array,
    count: React.PropTypes.number,
    graphClassName: React.PropTypes.string,
    options: React.PropTypes.arrayOf(React.PropTypes.string)
  },

  render: function() {

    if (!this.props.columns || !this.props.options) {
      return null;
    }

    var graphs = [];
    for (var i = 0; i < this.props.count; i++) {
      graphs.push(
        <ViewpointsGraph className={this.props.graphClassName}
            columns={this.props.columns}
            key={i}
            options={this.props.options}/>
      );
    }

    return <div className={this.props.className || 'vp-graphs'}>{graphs}</div>;
  }
});

module.exports = Graphs;
