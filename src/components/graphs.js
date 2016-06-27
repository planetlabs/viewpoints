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
    highlightFunction: React.PropTypes.func,
    viewportClassName: React.PropTypes.string,
    normalIndicesArrays: React.PropTypes.array,
    highlightedIndicesArrays: React.PropTypes.array
  },

  componentWillReceiveProps(nextProps) {
    // console.log("About to receive new columns:", nextProps.columns);
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
            highlightFunction={this.props.highlightFunction}
            normalIndicesArrays={this.props.normalIndicesArrays}
            highlightedIndicesArrays={this.props.highlightedIndicesArrays}/>
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
