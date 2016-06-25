var React = require('react');
var ReactDOM = require('react-dom');
var Webgl = require('../util/webgl');

var Viewport = React.createClass({

  propTypes: {
    columns: React.PropTypes.array,
    height: React.PropTypes.number,
    options: React.PropTypes.arrayOf(React.PropTypes.string),
    width: React.PropTypes.number,
    xAxisSelectedIndex: React.PropTypes.number,
    yAxisSelectedIndex: React.PropTypes.number
  },

  vertexShader: `
    attribute vec2 a_position;

    void main() {
       gl_Position = vec4(a_position, 0, 1);
       gl_PointSize = 2.0;
    }
  `,

  fragmentShader: `
    precision mediump float;

    uniform vec4 u_color;

    void main() {
       gl_FragColor = u_color;
    }
  `,

  componentDidMount: function() {
    var canvas = ReactDOM.findDOMNode(this);
    this._prepareWebgl(canvas);
    this._setAxes(canvas);
    this._paint(canvas);
  },

  componentDidUpdate: function() {
    var canvas = ReactDOM.findDOMNode(this);
    this._setAxes(canvas);
    this._paint(canvas);
  },

  _prepareWebgl: function(canvas) {
    var gl = Webgl.initWebGL(canvas);
    var program = Webgl.createProgramFromScripts(gl, this.vertexShader, this.fragmentShader);

    gl.useProgram(program);

    gl.enable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    this.indexBuffer = indexBuffer;

    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    // set the resolution
    // var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    // gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

    var colorLocation = gl.getUniformLocation(program, "u_color");
    this.colorLocation = colorLocation;
    this.gl = gl;
  },

  _paint: function(canvas) {
    console.log('painting');
    var gl = this.gl;
    var colorLocation = this.colorLocation;
    function setColor(r, g, b, a) {
        gl.uniform4f(colorLocation, r/255, g/255, b/255, a);
    }

    // Draw background rectangle
    gl.blendFunc(gl.ONE, gl.ZERO);
    Webgl.setRectangle(gl, 0, 0, canvas.width, canvas.height);
    setColor(0, 0, 0, 1);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    // Draw the data points themselves
    // Okay so... In the name of cross browser compatibility,
    // calls to drawElements can only be made using vertex buffers
    // with data types of short or byte. That means that index
    // buffers cannot contain values greater than 65,536.
    // To draw more than 65k vertices, we have to split up our
    // vertex arrays into smaller sub arrays, then render them
    // using drawElements separately.
    // console.log("ptarrays", this.ptArrays);
    // console.log("normal indices", this.normalIndicesArrays);
    for (var i = 0; i < this.ptArrays.length; i++) {
      var pts = this.ptArrays[i];
      var normalIndices = this.normalIndicesArrays[i];
      // let highlightedIndices = highlightedIndicesArrays[i];

      // Default color
      var residualColor = 1;
      setColor(255, residualColor, residualColor, 0.9);

      Webgl.setPoints(gl, pts);

      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(normalIndices), gl.STATIC_DRAW);
      gl.drawElements(
          gl.POINTS, normalIndices.length, gl.UNSIGNED_SHORT, canvas.indexBuffer);
    }
  },

  _setAxes: function(canvas) {
    var xAxis = this.props.columns[this.props.xAxisSelectedIndex];
    var yAxis = this.props.columns[this.props.yAxisSelectedIndex];

    var xMax = null;
    var xMin = null;
    for (var i = 0; i < xAxis.length; i++) {
      if (!isNaN(xAxis[i])) {
        if (xAxis[i] > xMax || xMax === null) {
          xMax = xAxis[i];
        }
        if (xAxis[i] < xMin || xMin === null) {
          xMin = xAxis[i];
        }
      }
    }

    var yMax = null;
    var yMin = null;
    for (var i = 0; i < yAxis.length; i++) {
      if (!isNaN(yAxis[i])) {
        if (yAxis[i] > yMax || yMax === null) {
          yMax = yAxis[i];
        }
        if (yAxis[i] < yMin || yMin === null) {
          yMin = yAxis[i];
        }
      }
    }

    var bufferPercent = 0.05;
    var xRange = xMax - xMin;
    xMax = xMax + (bufferPercent * xRange);
    xMin = xMin - (bufferPercent * xRange);
    var xScale = 2 / (xMax - xMin);

    var yRange = yMax - yMin;
    yMax = yMax + (bufferPercent * yRange);
    yMin = yMin - (bufferPercent * yRange);
    var yScale = 2 / (yMax - yMin);

    var pts = [];
    var ptArrays = [];
    var normalIndices = [];
    // var highlightedIndices = [];
    var normalIndicesArrays = [];
    // var highlightedIndicesArrays = [];

    var maxPerArray = 65530;

    var i = 0;

    console.log("IN mathy bitsx", xMin, xScale);
    console.log("IN mathy bits", yMin, yScale);

    while (i < xAxis.length) {
      pts.push((xAxis[i] - xMin) * xScale - 1);
      pts.push((yAxis[i] - yMin) * yScale - 1);

      normalIndices.push(i % maxPerArray);

      i++;

      if (i % maxPerArray === 0 || i === xAxis.length) {
          ptArrays.push(pts);
          pts = [];

          normalIndicesArrays.push(normalIndices);
          normalIndices = [];

          // highlightedIndicesArrays.push(highlightedIndices);
          // highlightedIndices = [];
      }

      if (i === xAxis.length) {
          break;
      }
    }
    this.normalIndicesArrays = normalIndicesArrays;
    this.ptArrays = ptArrays;
  },

  render: function() {
    return (
      <canvas height={this.props.height}
          width={this.props.width}>
        I am a viewport!
      </canvas>
    );
  }
});

module.exports = Viewport;
