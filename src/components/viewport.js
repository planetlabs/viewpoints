var React = require('react');
var ReactDOM = require('react-dom');

var Viewport = React.createClass({

  componentDidMount: function() {
    this._paint();
  },

  _paint: function() {
    var context = ReactDOM.findDOMNode(this).getContext('2d');
    context.fillStyle = '#F00';
    context.fillRect(0, 0, 100, 100);
    console.log('painted');
  },

  render: function() {
    return <canvas>I am a viewport!</canvas>;
  }
});

module.exports = Viewport;
