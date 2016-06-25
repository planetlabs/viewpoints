var React = require('react');

var Graph = require('./graph');

var Graphs = React.createClass({

  propTypes: {
    axesClassName: React.PropTypes.string,
    className: React.PropTypes.string,
    columns: React.PropTypes.array,
    count: React.PropTypes.number,
    graphClassName: React.PropTypes.string,
    options: React.PropTypes.arrayOf(React.PropTypes.string),
    rowClassName: React.PropTypes.string,
    viewportClassName: React.PropTypes.string
  },

  render: function() {

    if (!this.props.columns || !this.props.options) {
      return null;
    }

    var rows = [];
    for (var i = 0; i < this.props.count; i++) {
      var rowIndex = this.props.count > 2 ?
          Math.round(i / this.props.count) : 0;
      if (!rows[rowIndex]) {
        rows[rowIndex] = [];
      }
      rows[rowIndex].push(
        <Graph axesClassName={this.props.axesClassName}
            className={this.props.graphClassName}
            columns={this.props.columns}
            key={i}
            options={this.props.options}
            viewportClassName={this.props.viewportClassName}/>
      );
    }

    return (
      <div className={this.props.className || 'vp-graphs'}>
        {rows.map((graphs, index) => {
          return (
            <div className={this.props.rowClassName || 'vp-graphs-row'}
                key={index}>
              {graphs}
            </div>
          );
        })}
      </div>
    );
  }
});

module.exports = Graphs;
