var React = require('react');
var ReactDOM = require('react-dom');
var Webgl = require('../util/webgl');

var Viewport = React.createClass({

  vertexShader: `
    attribute vec2 a_position;

    uniform vec2 u_resolution;

    void main() {
       // convert the rectangle from pixels to 0.0 to 1.0
       vec2 zeroToOne = a_position / u_resolution;

       // convert from 0->1 to 0->2
       vec2 zeroToTwo = zeroToOne * 2.0;

       // convert from 0->2 to -1->+1 (clipspace)
       vec2 clipSpace = zeroToTwo - 1.0;

       gl_Position = vec4(clipSpace, 0, 1);
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
    canvas.indexBuffer = indexBuffer;

    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    // set the resolution
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");

    var colorLocation = gl.getUniformLocation(program, "u_color");
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    canvas.colorLocation = colorLocation;
    this.gl = gl;
  },

  _paint: function(canvas) {
    console.log('painting');
    var gl = this.gl;
    var colorLocation = canvas.colorLocation;
    function setColor(r, g, b, a) {
        gl.uniform4f(canvas.colorLocation, r/255, g/255, b/255, a);
    }

    // Draw background rectangle
    Webgl.setRectangle(gl, 0, 0, canvas.width, canvas.height);
    // setColor(0, 182, 255);
    setColor(0, 0, 0, 1);
    gl.drawArrays(gl.TRIANGLES, 0, 6);


    console.log('painted');
  },

  render: function() {
    return <canvas>I am a viewport!</canvas>;
  }
});

module.exports = Viewport;
