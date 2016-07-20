var React = require('react');

var Sidebar = React.createClass({

  propTypes: {
    onPointSizeChange: React.PropTypes.func,
    pointSize: React.PropTypes.number
  },

  _onPointSizeChange: function(event) {
    this.props.onPointSizeChange(parseFloat(event.target.value));
  },

  render: function() {

    var items = [
      {
        label: 'Point size',
        value: this.props.pointSize,
        input: (
          <input max="10"
              min="0.5"
              onChange={this._onPointSizeChange}
              step="0.1"
              type="range"
              value={this.props.pointSize}/>
        )
      }
    ];

    return (
      <div className="vp-sidebar">
        {items.map(function(item, index) {
          return (
            <div className="vp-sidebar-item" key={index}>
              <div className="vp-sidebar-item-value">{item.value}</div>
              <div className="vp-sidebar-item-label">{item.label}</div>
              {item.input}
            </div>
          )
        })}
      </div>
    );
  }
});

module.exports = Sidebar;
