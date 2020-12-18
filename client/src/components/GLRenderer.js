import Renderer from './Renderer';

class GLRenderer extends Renderer {
  constructor(canvas) {
    if (canvas) {
      this.gl = canvas.getContext('webgl');
      if (this.gl) {
        this.vertexShader = this.createShader(
          this.gl,
          this.gl.VERTEX_SHADER,
          document.querySelector('#vertex-shader').innerHTML
        );
        this.fragmentShader = this.createShader(
          this.gl,
          this.gl.FRAGMENT_SHADER,
          document.querySelector('#fragment-shader').innerHTML
        );
        this.program = this.createProgram(this.gl, this.vertexShader, this.fragmentShader);
        this.gl.useProgram(this.program);
        this.positionAttributeLocation = this.gl.getAttribLocation(this.program, 'a_position');
        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        // bind position buffer and describe/send its data
        this.positionBuffer = this.gl.createBuffer();

        // this.vaoObjOne = this.gl.createVertexArray();
        // this.vaoObjTwo = this.gl.createVertexArray();
        const size = 2;
        const type = this.gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;

        // this.gl.bindVertexArray(this.vaoObjOne);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.vertexAttribPointer(
          this.positionAttributeLocation,
          size,
          type,
          normalize,
          stride,
          offset
        );

        const objOnePos = [0, -0.5, 0, 0.5, 0.7, 0];
        // this.gl.bufferData(this.gl.ARRAY_BUFFER, 4 * 12, this.gl.STATIC_DRAW);
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array(objOnePos));
        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        // this.gl.bindVertexArray(this.vaoObjTwo);
        const objTwoPos = [-1, 0.5, 0, 1.0, 0.7, 0.5];
        // this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(objTwoPos), this.gl.STATIC_DRAW);
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 4 * 6, new Float32Array(objTwoPos));
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
      }
    }
  }

  createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.thisource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
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
    if (this.gl) {
      // this.gl.bindVertexArray(this.vao);
      this.gl.clearColor(0.1, 0.1, 0.1, 1);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
      var primitiveType = this.gl.TRIANGLES;
      var offset = 0;
      var count = 6;
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
      this.gl.drawArrays(primitiveType, 0, count);
      // this.gl.drawArrays(primitiveType, 4 * 2 * 8, count);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    }
  }
}

export default GLRenderer;