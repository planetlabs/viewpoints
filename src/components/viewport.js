var React = require('react');
var ReactDOM = require('react-dom');
var Webgl = require('../util/webgl');

var Viewport = React.createClass({

  propTypes: {
    columns: React.PropTypes.array,
    height: React.PropTypes.number,
    options: React.PropTypes.arrayOf(React.PropTypes.string),
    width: React.PropTypes.number,
    highlightFunction: React.PropTypes.func,
    xAxisSelectedIndex: React.PropTypes.number,
    yAxisSelectedIndex: React.PropTypes.number,
    normalIndicesArrays: React.PropTypes.array,
    highlightedIndicesArrays: React.PropTypes.array
  },

  getInitialState() {
    return {
      mouseIsDown: false,
      mouseDownX: 0,
      mouseDownY: 0,
      mouseUpX: 0,
      mouseUpY: 0
    };
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

    canvas.addEventListener('mousedown', this.mousedown);
    canvas.addEventListener('mousemove', this.mousemove);
    canvas.addEventListener('mouseup', this.mouseup);
  },

  componentDidUpdate: function() {
    var canvas = ReactDOM.findDOMNode(this);
    this.gl.viewport(0, 0, this.props.width, this.props.height);
    this._paint(canvas);
  },
  componentWillReceiveProps(nextProps) {
    var canvas = ReactDOM.findDOMNode(this);

    if (this.props.xAxisSelectedIndex != nextProps.xAxisSelectedIndex ||
        this.props.yAxisSelectedIndex != nextProps.yAxisSelectedIndex) {
      this._setAxes(
        canvas, nextProps.xAxisSelectedIndex, nextProps.yAxisSelectedIndex);
    }
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
    var gl = this.gl;
    var colorLocation = this.colorLocation;
    function setColor(r, g, b, a) {
        gl.uniform4f(colorLocation, r/255, g/255, b/255, a);
    }

    // Draw background rectangle
    gl.blendFunc(gl.ONE, gl.ZERO);
    Webgl.setRectangle(gl, -1, -1, 2, 2);
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

    // Draw the red (normal) points
    var residualColor = 1;
    setColor(255, residualColor, residualColor, 0.9);
    for (var i = 0; i < this.ptArrays.length; i++) {
      var pts = this.ptArrays[i];
      var normalIndices = this.props.normalIndicesArrays[i];


      Webgl.setPoints(gl, pts);

      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(normalIndices), gl.STATIC_DRAW);
      gl.drawElements(
          gl.POINTS, normalIndices.length, gl.UNSIGNED_SHORT, canvas.indexBuffer);
    }

    // Set pen to black and clear the spots that were already red
    gl.blendFunc(gl.ONE, gl.ZERO);
    setColor(0, 0, 0, 1);
    for (var i = 0; i < this.ptArrays.length; i++) {
      var pts = this.ptArrays[i];
      var highlightedIndices = this.props.highlightedIndicesArrays[i];

      Webgl.setPoints(gl, pts);

      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(highlightedIndices), gl.STATIC_DRAW);
      gl.drawElements(
          gl.POINTS, highlightedIndices.length, gl.UNSIGNED_SHORT, canvas.indexBuffer);
    }

    // Set the pen to blue and draw the highlighted points
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    setColor(residualColor, residualColor, 255, 0.9);
    for (var i = 0; i < this.ptArrays.length; i++) {
      var pts = this.ptArrays[i];
      var highlightedIndices = this.props.highlightedIndicesArrays[i];

      Webgl.setPoints(gl, pts);

      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(highlightedIndices), gl.STATIC_DRAW);
      gl.drawElements(
          gl.POINTS, highlightedIndices.length, gl.UNSIGNED_SHORT, canvas.indexBuffer);
    }

    // Draw the lines of the selection box
    if (this.state.mouseIsDown) {
      setColor(250, 80, 60, 1);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        this.state.mouseDownX, this.state.mouseDownY,
        this.state.mouseDownX, this.state.mouseUpY,
        this.state.mouseUpX, this.state.mouseDownY,
        this.state.mouseUpX, this.state.mouseUpY]), gl.STATIC_DRAW);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([
        0, 1,
        0, 2,
        2, 3,
        1, 3]), gl.STATIC_DRAW);
      gl.drawElements(
        gl.LINES, 8, gl.UNSIGNED_SHORT, canvas.indexBuffer);
    }
  },

  _setAxes: function(canvas, indexX, indexY) {
    var xAxis = this.props.columns[indexX || this.props.xAxisSelectedIndex];
    var yAxis = this.props.columns[indexY || this.props.yAxisSelectedIndex];

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

    var maxPerArray = 65530;

    var i = 0;

    while (i < xAxis.length) {
      pts.push((xAxis[i] - xMin) * xScale - 1);
      pts.push((yAxis[i] - yMin) * yScale - 1);

      i++;

      if (i % maxPerArray === 0 || i === xAxis.length) {
          ptArrays.push(pts);
          pts = [];
      }
    }

    this.ptArrays = ptArrays;
  },

  mousedown: function(event) {
    var x = (event.offsetX / this.props.width) * 2 - 1;
    var y = ((event.target.height - event.offsetY) / this.props.height) * 2 - 1;
    this.setState({
      mouseIsDown: true,
      mouseDownX: x,
      mouseUpX: x,
      mouseDownY: y,
      mouseUpY: y
    });
  },

  mousemove: function(event) {
    var x = (event.offsetX / this.props.width) * 2 - 1;
    var y = ((event.target.height - event.offsetY) / this.props.height) * 2 - 1;
    if (this.state.mouseIsDown === true) {
      this.props.highlightFunction(
        this.ptArrays,
        this.state.mouseDownX, x,
        this.state.mouseDownY, y);

      this.setState({
        mouseUpX: x,
        mouseUpY: y
      });
    }
  },

  mouseup: function(event) {
    var x = (event.offsetX / this.props.width) * 2 - 1;
    var y = ((event.target.height - event.offsetY) / this.props.height) * 2 - 1;
    this.setState({
      mouseIsDown: false,
      mouseUpX: x,
      mouseUpY: y
    });
  },

  render: function() {
    var style = {
      backgroundColor: "white"
    };
    return (
      <canvas height={this.props.height}
          style={style}
          width={this.props.width}>
        I am a viewport!
      </canvas>
    );
  }
});

module.exports = Viewport;
