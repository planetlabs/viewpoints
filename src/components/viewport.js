var React = require('react');
var Webgl = require('../util/webgl');
var platform = require('platform');

var Viewport = React.createClass({

  propTypes: {
    columns: React.PropTypes.array,
    enums: React.PropTypes.array,
    height: React.PropTypes.number,
    highlightFunction: React.PropTypes.func,
    highlightedIndicesArrays: React.PropTypes.array,
    normalIndicesArrays: React.PropTypes.array,
    options: React.PropTypes.arrayOf(React.PropTypes.string),
    overpaintFactor: React.PropTypes.number,
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
      mouseDownRawX: 0,
      mouseDownRawY: 0,
      mouseUpX: 0,
      mouseUpY: 0,
      translationX: 0,
      translationY: 0,
      zoomX: 0.8,
      zoomY: 0.8
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
    var canvas = this.refs.webglCanvas;
    this._prepareWebgl(canvas);
    this._setAxes(canvas);
    this._paint(canvas);

    canvas.addEventListener('mousedown', this.mousedown);
    canvas.addEventListener('mousemove', this.mousemove);
    canvas.addEventListener('mouseup', this.mouseup);

    var hudCanvas = this.refs.hudCanvas;
    this._paintHud(hudCanvas);
  },

  componentDidUpdate: function(prevProps, prevState) {
    var canvas = this.refs.webglCanvas;
    this.gl.viewport(0, 0, this.props.width, this.props.height);
    if (this.props.columns !== prevProps.columns) {
      this._setAxes(canvas);
    }
    else if (this.state.mouseUpX === prevState.mouseUpX && this.state.mouseUpY === prevState.mouseUpY) {
      this._paint(canvas);
    }

    var hudCanvas = this.refs.hudCanvas;
    this._paintHud(hudCanvas);
  },
  componentWillReceiveProps(nextProps) {
    var canvas = this.refs.webglCanvas;
    if (this.props.xAxisSelectedIndex != nextProps.xAxisSelectedIndex ||
        this.props.yAxisSelectedIndex != nextProps.yAxisSelectedIndex) {
      this._setAxes(
        canvas, nextProps.xAxisSelectedIndex, nextProps.yAxisSelectedIndex);
      this.setState({
        zoomX: 0.8,
        zoomY: 0.8,
        translationX: 0,
        translationY: 0
      });
    }
  },

  _paintHud(canvas) {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var yellow = 'rgb(200, 200, 0)';
    var offset = 60;
    var suboffset = 30;

    // Lines
    ctx.lineWidth = '1';
    ctx.beginPath();
    ctx.strokeStyle = yellow;
    ctx.moveTo(offset, offset);
    ctx.lineTo(offset, canvas.height - offset);
    ctx.lineTo(canvas.width - offset, canvas.height - offset);

    var xAxisTitle = this.props.options[this.props.xAxisSelectedIndex];
    var yAxisTitle = this.props.options[this.props.yAxisSelectedIndex];

    ctx.fillStyle = yellow;
    ctx.font = '15px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(xAxisTitle, canvas.width / 2, canvas.height - offset / 2);

    var axesMaxX = (this._rawToNormalizedX({offsetX: canvas.width - offset}) + 1) / 2 * (this.xMax - this.xMin) + this.xMin;
    ctx.fillText(axesMaxX.toFixed(2), canvas.width - offset, canvas.height - offset / 2);
    ctx.moveTo(canvas.width - offset, canvas.height - offset);
    ctx.lineTo(canvas.width - offset, canvas.height - offset + 8);

    var axesMinX = (this._rawToNormalizedX({offsetX: offset + suboffset}) + 1) / 2 * (this.xMax - this.xMin) + this.xMin;
    ctx.fillText(axesMinX.toFixed(2), offset + suboffset, canvas.height - offset / 2);
    ctx.moveTo(offset + suboffset, canvas.height - offset);
    ctx.lineTo(offset + suboffset, canvas.height - offset + 8);

    ctx.textAlign = 'left';
    var axesMaxY = (this._rawToNormalizedY({offsetY: offset, target: {height: canvas.height}}) + 1) / 2 * (this.yMax - this.yMin) + this.yMin;
    ctx.fillText(axesMaxY.toFixed(2), 5, offset);
    ctx.moveTo(offset, offset);
    ctx.lineTo(offset - 8, offset);

    var axesMinY = (this._rawToNormalizedY({offsetY: canvas.height - offset - suboffset, target: {height: canvas.height}}) + 1) / 2 * (this.yMax - this.yMin) + this.yMin;
    ctx.fillText(axesMinY.toFixed(2), 5, canvas.height - offset - suboffset);
    ctx.moveTo(offset, canvas.height - offset - suboffset);
    ctx.lineTo(offset - 8, canvas.height - offset - suboffset);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.translate(offset, canvas.height / 2);
    ctx.rotate(-90 * Math.PI / 180);
    ctx.fillText(yAxisTitle, 0, -offset / 2);
    ctx.rotate(90 * Math.PI / 180);
    ctx.translate(-offset, -canvas.height / 2);


  },

  _prepareWebgl: function(canvas) {
    var gl = Webgl.initWebGL(canvas);
    var program = Webgl.createProgramFromScripts(gl, this.vertexShader, this.fragmentShader);

    gl.useProgram(program);

    gl.disable(gl.DEPTH_TEST);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.clearColor(0, 0, 0, 1);

    gl.enable(gl.STENCIL_TEST);
    gl.stencilMask(0xFF);
    gl.clearStencil(0);

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


    this.colorLocation =  gl.getUniformLocation(program, 'u_color');
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
    gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    // Draw the data points themselves
    // Okay so... In the name of cross browser compatibility,
    // calls to drawElements can only be made using vertex buffers
    // with data types of short or byte. That means that index
    // buffers cannot contain values greater than 65,536.
    // To draw more than 65k vertices, we have to split up our
    // vertex arrays into smaller sub arrays, then render them
    // using drawElements separately.

    if (this.props.normalIndicesArrays.length === 0) {
      return;
    }


    gl.stencilFunc(gl.GEQUAL, 3, 0xFFFF);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
    // Set the pen to blue and draw the highlighted points
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    setColor(this.props.overpaintFactor, this.props.overpaintFactor, 255, 0.9);
    for (let i = 0; i < this.ptArrays.length; i++) {
      let pts = this.ptArrays[i];
      let highlightedIndices = this.props.highlightedIndicesArrays[i];

      Webgl.setVertexBuffer(gl, pts);

      Webgl.setIndexBuffer(gl, highlightedIndices);
      gl.drawElements(
          gl.POINTS, highlightedIndices.length, gl.UNSIGNED_SHORT, canvas.indexBuffer);
    }


    gl.stencilFunc(gl.GEQUAL, 2, 0xFFFF);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
    // Draw the red (normal) points
    setColor(255, this.props.overpaintFactor, this.props.overpaintFactor, 0.9);
    for (let i = 0; i < this.ptArrays.length; i++) {
      let pts = this.ptArrays[i];
      var normalIndices = this.props.normalIndicesArrays[i];

      Webgl.setVertexBuffer(gl, pts);

      Webgl.setIndexBuffer(gl, normalIndices);

      gl.drawElements(
          gl.POINTS, normalIndices.length, gl.UNSIGNED_SHORT, canvas.indexBuffer);
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

    // Draw the lines of the axes
    setColor(250, 250, 0, 1);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([
      0, 1,
      1, 2]), gl.STATIC_DRAW);
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


    var xScale = 2 / (xMax - xMin);
    var yScale = 2 / (yMax - yMin);

    var pts = [];
    var ptArrays = [];

    var maxPerArray = 65530; // TODO: pull this into a global variable
    // It is replicated in graph.js

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

    this.xMin = xMin;
    this.xMax = xMax;
    this.yMin = yMin;
    this.yMax = yMax;

    this.ptArrays = ptArrays;
  },

  _rawToNormalizedX: function(event) {
    return ((event.offsetX / this.props.width) * 2 - 1) / this.state.zoomX - this.state.translationX;
  },

  _rawToNormalizedY: function(event) {
    return (((event.target.height - event.offsetY) / this.props.height) * 2 - 1) / this.state.zoomY - this.state.translationY;
  },

  _normalizedToRawX: function(x) {
    return (((x + this.state.translationX) * this.state.zoomX) + 1) / 2 * this.props.width;
  },

  _normalizedToRawY: function(y) {
    return (((y + this.state.translationY) * this.state.zoomY) + 1) / 2 * this.props.height;
  },

  mousedown: function(event) {
    var x = this._rawToNormalizedX(event);
    var y = this._rawToNormalizedY(event);
    this.setState({
      mouseIsDown: true,
      mouseDownX: x,
      mouseDownRawX: event.offsetX,
      mouseUpX: x,
      mouseDownY: y,
      mouseDownRawY: event.target.height - event.offsetY,
      mouseUpY: y
    });
  },

  mousemove: function(event) {
    var x = this._rawToNormalizedX(event);
    var y = this._rawToNormalizedY(event);

    // Mac or linux
    let panKeyDown = event.metaKey === true;
    let zoomKeyDown = event.altKey === true;

    if (platform.os.family.indexOf('Win') > -1) {
      console.log('On a windows machine');
      panKeyDown = event.altKey === true;
      zoomKeyDown = event.ctrlKey === true;
    }

    if (this.state.mouseIsDown === true) {
      if (panKeyDown) {
        // Pan
        let fracX = event.movementX / event.target.width * 2 / this.state.zoomX;
        let fracY = -event.movementY / event.target.height * 2 / this.state.zoomY;

        this.setState({
          translationX: this.state.translationX + fracX,
          translationY: this.state.translationY + fracY
        });
      }
      else if (zoomKeyDown) {
        // Zoom
        let fracX = event.movementX / event.target.width * 2;
        let fracY = -event.movementY / event.target.height * 2;

        let newZoomX = this.state.zoomX * (1 + fracX);
        let newZoomY = this.state.zoomY * (1 + fracY);

        // If we zoom in, the x, y location of the mouseDownX, mouseDownY will
        // move. Set translation so that they do not move.
        // In other words: zoom in on the location that was clicked, not the origin
        let newMappedRawX = ((this.state.mouseDownRawX / this.props.width) * 2 - 1) / newZoomX - this.state.translationX;
        let xDiff = newMappedRawX - this.state.mouseDownX;

        let newMappedRawY = -(((event.target.height - this.state.mouseDownRawY) / this.props.height) * 2 - 1) / newZoomY - this.state.translationY;
        let yDiff = newMappedRawY - this.state.mouseDownY;

        this.setState({
          zoomX: newZoomX,
          zoomY: newZoomY,
          translationX: this.state.translationX + xDiff,
          translationY: this.state.translationY + yDiff
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
    var x = this._rawToNormalizedX(event);
    var y = this._rawToNormalizedY(event);
    this.setState({
      mouseIsDown: false,
      mouseUpX: x,
      mouseUpY: y
    });
  },

  render: function() {
    var hudStyle = {
      "pointer-events": "none"
    };
    return (
      <div>
        <canvas ref="webglCanvas" height={this.props.height}
          width={this.props.width}>
        </canvas>

        <canvas ref="hudCanvas" height={this.props.height}
          style={hudStyle}
          width={this.props.width}>
        </canvas>


      </div>
    );
  }
});

module.exports = Viewport;
