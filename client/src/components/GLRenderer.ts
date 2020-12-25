import Renderer from './Renderer';
import LCD from './LCDController';
import $ from 'jquery';

class GLRenderer extends Renderer {
  private gl: WebGL2RenderingContext;
  private vertexShader: WebGLShader;
  private fragmentShader: WebGLShader;
  private program: WebGLProgram;
  private positionAttributeLocation: GLint;
  private positionBuffer: WebGLBuffer;

  constructor() {
    super();

    const canvas: HTMLCanvasElement = $('<canvas/>').width(1920).height(1080).get(0) as HTMLCanvasElement;
    $('#canvas').append(canvas);

    if (canvas) {
      this.gl = canvas.getContext('webgl2');
      const gl: WebGL2RenderingContext = this.gl;
      if (gl) {
        this.vertexShader = this.createShader(
          gl,
          gl.VERTEX_SHADER,
          document.querySelector('#vertex-shader').innerHTML
        );
        this.fragmentShader = this.createShader(
          gl,
          gl.FRAGMENT_SHADER,
          document.querySelector('#fragment-shader').innerHTML
        );
        this.program = this.createProgram(gl, this.vertexShader, this.fragmentShader);
        gl.useProgram(this.program);
        this.positionAttributeLocation = gl.getAttribLocation(this.program, 'a_position');
        gl.enableVertexAttribArray(this.positionAttributeLocation);
        // bind position buffer and describe/send its data
        this.positionBuffer = gl.createBuffer();

        const size = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(
          this.positionAttributeLocation,
          size,
          type,
          normalize,
          stride,
          offset
        );

        let pixelBuffer = [];
        const xIncr = 2.0 / LCD.width;
        const yIncr = 2.0 / LCD.height;
        for (let x = 0; x < LCD.width; x++) {
          for (let y = 0; y < LCD.height; y++) {
            let topLeft = {x: -1.0 + (x * xIncr), y: -1.0 + (y * yIncr)};
            // triangle #1
            pixelBuffer.push(topLeft.x, topLeft.y);
            pixelBuffer.push(topLeft.x + xIncr, topLeft.y);
            pixelBuffer.push(topLeft.x + xIncr, topLeft.y + yIncr);
            // triangle #2
            pixelBuffer.push(topLeft.x, topLeft.y);
            pixelBuffer.push(topLeft.x, topLeft.y + yIncr);
            pixelBuffer.push(topLeft.x + xIncr, topLeft.y + yIncr);
          }
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pixelBuffer), gl.STATIC_DRAW);
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        // gl.bindVertexArray(this.vaoObjTwo);
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objTwoPos), gl.STATIC_DRAW);
        // gl.bufferSubData(gl.ARRAY_BUFFER, 4 * 6, new Float32Array(objTwoPos));
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
      }
    }
  }

  createShader(gl: WebGL2RenderingContext, type: number, source: string) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    const program: WebGLProgram = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }

  draw() {
    const { gl } = this;
    // gl.bindVertexArray(this.vao);
    gl.clearColor(0.5, 0.5, 0.5, 0.5);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.drawArrays(gl.TRIANGLES, 0, 6 * LCD.width * LCD.height);
    // gl.drawArrays(primitiveType, 4 * 2 * 8, count);
    // gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }
}

export default GLRenderer;