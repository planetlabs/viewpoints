var React = require('react');
var ReactDOM = require('react-dom');
var Webgl = require('../util/webgl');

var Viewport = React.createClass({

  propTypes: {
    columns: React.PropTypes.array,
    height: React.PropTypes.number,
    highlightFunction: React.PropTypes.func,
    highlightedIndicesArrays: React.PropTypes.array,
    normalIndicesArrays: React.PropTypes.array,
    options: React.PropTypes.arrayOf(React.PropTypes.string),
    pointSize: React.PropTypes.number,
    uid: React.PropTypes.number,
    width: React.PropTypes.number,
    xAxisSelectedIndex: React.PropTypes.number,
    yAxisSelectedIndex: React.PropTypes.number
  },

  getInitialState() {
    return {
      mouseIsDown: false,
      mouseDownX: 0,
      mouseDownY: 0,
      mouseUpX: 0,
      mouseUpY: 0,
      translationX: 0,
      translationY: 0,
      zoomX: 1,
      zoomY: 1
    };
  },

  vertexShader: `
    attribute vec2 a_position;
    uniform vec2 u_translation;
    uniform vec2 u_zoom;
    uniform float u_point_size;

    void main() {
       vec2 offset_position = (a_position + u_translation) * u_zoom;
       gl_Position = vec4(offset_position, 0, 1);
       gl_PointSize = u_point_size;
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

  componentDidUpdate: function(prevProps, prevState) {
    var canvas = ReactDOM.findDOMNode(this);
    this.gl.viewport(0, 0, this.props.width, this.props.height);
    if (this.props.columns !== prevProps.columns) {
      this._setAxes(canvas);
    }
    else if (this.state.mouseUpX === prevState.mouseUpX && this.state.mouseUpY === prevState.mouseUpY) {
      this._paint(canvas);
    }
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
    var positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    // set the resolution

    var colorLocation = gl.getUniformLocation(program, 'u_color');
    this.colorLocation = colorLocation;

    this.translationLocation = gl.getUniformLocation(program, 'u_translation');
    this.zoomLocation = gl.getUniformLocation(program, 'u_zoom');
    this.pointSizeLocation = gl.getUniformLocation(program, 'u_point_size');

    this.gl = gl;
  },

  _paint: function(canvas) {
    this.gl.uniform2f(this.translationLocation, this.state.translationX, this.state.translationY);
    this.gl.uniform2f(this.zoomLocation, this.state.zoomX, this.state.zoomY);
    this.gl.uniform1f(this.pointSizeLocation, this.props.pointSize);

    var gl = this.gl;
    var colorLocation = this.colorLocation;
    function setColor(r, g, b, a) {
      gl.uniform4f(colorLocation, r / 255, g / 255, b / 255, a);
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
    var residualColor = 3;
    setColor(255, residualColor, residualColor, 0.9);
    if (this.props.normalIndicesArrays.length === 0) {
      return;
    }
    for (let i = 0; i < this.ptArrays.length; i++) {
      let pts = this.ptArrays[i];
      var normalIndices = this.props.normalIndicesArrays[i];

      Webgl.setVertexBuffer(gl, pts);

      Webgl.setIndexBuffer(gl, normalIndices);

      gl.drawElements(
          gl.POINTS, normalIndices.length, gl.UNSIGNED_SHORT, canvas.indexBuffer);
    }

    // Set pen to black and clear the spots that were already red
    gl.blendFunc(gl.ONE, gl.ZERO);
    setColor(0, 0, 0, 1);
    for (let i = 0; i < this.ptArrays.length; i++) {
      let pts = this.ptArrays[i];
      let highlightedIndices = this.props.highlightedIndicesArrays[i];

      Webgl.setVertexBuffer(gl, pts);

      Webgl.setIndexBuffer(gl, highlightedIndices);

      gl.drawElements(
          gl.POINTS, highlightedIndices.length, gl.UNSIGNED_SHORT, canvas.indexBuffer);
    }

    // Set the pen to blue and draw the highlighted points
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    setColor(residualColor, residualColor, 255, 0.9);
    for (let i = 0; i < this.ptArrays.length; i++) {
      let pts = this.ptArrays[i];
      let highlightedIndices = this.props.highlightedIndicesArrays[i];

      Webgl.setVertexBuffer(gl, pts);

      Webgl.setIndexBuffer(gl, highlightedIndices);
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
    // console.log('painted on canvas', this.props.uid);
  },

  _setAxes: function(canvas, indexX = this.props.xAxisSelectedIndex, indexY = this.props.yAxisSelectedIndex) {
    var xAxis = this.props.columns[indexX];
    var yAxis = this.props.columns[indexY];

    var xMax = null;
    var xMin = null;
    for (let i = 0; i < xAxis.length; i++) {
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
    for (let i = 0; i < yAxis.length; i++) {
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
        ptArrays.push(new Float32Array(pts));
        pts = [];
      }
    }

    this.ptArrays = ptArrays;
  },

  _fixX: function(event) {
    return ((event.offsetX / this.props.width) * 2 - 1) / this.state.zoomX - this.state.translationX;
  },

  _fixY: function(event) {
    return (((event.target.height - event.offsetY) / this.props.height) * 2 - 1) / this.state.zoomY - this.state.translationY;
  },

  mousedown: function(event) {
    var x = this._fixX(event);
    var y = this._fixY(event);
    this.setState({
      mouseIsDown: true,
      mouseDownX: x,
      mouseUpX: x,
      mouseDownY: y,
      mouseUpY: y
    });
  },

  mousemove: function(event) {
    var x = this._fixX(event);
    var y = this._fixY(event);
    if (this.state.mouseIsDown === true) {
      if (event.metaKey === true) {
        // Pan
        let fracX = event.movementX / event.target.width * 2 / this.state.zoomX;
        let fracY = -event.movementY / event.target.height * 2 / this.state.zoomY;

        this.setState({
          translationX: this.state.translationX + fracX,
          translationY: this.state.translationY + fracY
        });
      }
      else if (event.altKey === true) {
        // Zoom
        console.log("X, Y: ", x, y);

        let fracX = event.movementX / event.target.width * 2;
        let fracY = -event.movementY / event.target.height * 2;

        let newZoomX = this.state.zoomX * (1 + fracX);
        let newZoomY = this.state.zoomY * (1 + fracY);

        // If we zoom in, the x, y location of the mouseDownX, mouseDownY will
        // move. Set translation so that they do not move.
        // let newX = ((this.state.mouseDownX / this.props.width) * 2 - 1) / newZoomX - this.state.translationX;
        // let newY = (((event.target.height - this.state.mouseDownY) / this.props.height) * 2 - 1) / newZoomY - this.state.translationY;

        // let newTx = newX - ;
        // let newTy = this.state.translationY * (newZoomY / this.state.zoomY);

        this.setState({
          zoomX: newZoomX,
          zoomY: newZoomY,
          // translationX: newTx,
          // translationY: newTy
        });
      }
      else {
        // Just do highlighting of points
        this.setState({
          mouseUpX: x,
          mouseUpY: y
        });

        this.props.highlightFunction(
          this.ptArrays,
          this.state.mouseDownX, x,
          this.state.mouseDownY, y);

      }
    }
  },

  mouseup: function(event) {
    var x = this._fixX(event);
    var y = this._fixY(event);
    this.setState({
      mouseIsDown: false,
      mouseUpX: x,
      mouseUpY: y
    });
  },

  render: function() {
    var style = {
      backgroundColor: 'white'
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
