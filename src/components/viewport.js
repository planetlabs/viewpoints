var React = require('react');
var ReactDOM = require('react-dom');

var Viewport = React.createClass({
  render: function() {
    return <canvas>I am a viewport!</canvas>;
  },
  componentDidMount: function() {
    var context = ReactDOM.findDOMNode(this).getContext('2d');
    this.paint(context);
  },
  componentDidUpdate: function() {
    var context = ReactDOM.findDOMNode(this).getContext('2d');
    context.clearRect(0, 0, 200, 200);
    this.paint(context);
  },
  paint: function(context) {
    context.fillStyle = '#F00';
    context.fillRect(0, 0, 100, 100);
    console.log("painted");
  },
});

module.exports = Viewport;
