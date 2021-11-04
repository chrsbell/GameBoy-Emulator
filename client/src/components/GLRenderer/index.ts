import PPU from 'PPU/index';

const colorSchemes = {
  default: {
    0: [255, 255, 255, 255],
    1: [170, 170, 170, 255],
    2: [85, 85, 85, 255],
    3: [0, 0, 0, 255],
  },
  classic: {
    0: [155, 188, 15, 255],
    1: [139, 172, 15, 255],
    2: [48, 98, 48, 255],
    3: [16, 56, 16, 255],
  },
};

class GLRenderer {
  private timeout!: number;
  private gl!: WebGL2RenderingContext;
  private vertexShader!: WebGLShader;
  private fragmentShader!: WebGLShader;
  private program!: WebGLProgram;
  private positionAttributeLocation!: GLint;
  private positionBuffer!: WebGLBuffer;
  private textureCoordBuffer!: WebGLBuffer;
  private textureCoordAttributeLocation!: GLint;
  private samplerUniformLocation!: GLint;
  private screenTexture!: WebGLTexture;
  public static screenWidth = 160;
  public static screenHeight = 144;
  public ppu!: PPU;
  public colorScheme: ColorScheme = colorSchemes.classic;

  constructor() {}

  public initialize = (canvas: HTMLCanvasElement): void => {
    if (canvas) {
      this.gl = canvas.getContext('webgl2')!;
      const gl: WebGL2RenderingContext = this.gl;
      const vertexElement: HTMLElement = document.getElementById(
        'vertex-shader'
      ) as HTMLElement;
      const fragmentElement: HTMLElement = document.getElementById(
        'fragment-shader'
      ) as HTMLElement;
      if (!vertexElement || !fragmentElement) {
        throw new Error(`Couldn't find shader source.`);
      }

      if (gl) {
        this.vertexShader = this.createShader(
          gl,
          gl.VERTEX_SHADER,
          vertexElement.innerHTML
        );
        this.fragmentShader = this.createShader(
          gl,
          gl.FRAGMENT_SHADER,
          fragmentElement.innerHTML
        );
        this.program = this.createProgram(
          gl,
          this.vertexShader,
          this.fragmentShader
        );
        gl.useProgram(this.program);

        this.positionAttributeLocation = gl.getAttribLocation(
          this.program,
          'aPosition'
        );
        gl.enableVertexAttribArray(this.positionAttributeLocation);

        this.textureCoordAttributeLocation = gl.getAttribLocation(
          this.program,
          'aTextureCoord'
        );
        gl.enableVertexAttribArray(this.textureCoordAttributeLocation);

        this.positionBuffer = gl.createBuffer()!;
        this.textureCoordBuffer = gl.createBuffer()!;

        this.screenTexture = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_2D, this.screenTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          GLRenderer.screenWidth,
          GLRenderer.screenHeight,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          new Uint8Array(92160).fill(255)
        );

        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.uniform1i(this.samplerUniformLocation, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
        gl.vertexAttribPointer(
          this.textureCoordAttributeLocation,
          2,
          gl.FLOAT,
          false,
          0,
          0
        );
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0]),
          gl.STATIC_DRAW
        );
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
      gl.vertexAttribPointer(
        this.positionAttributeLocation,
        2,
        gl.FLOAT, //benchmark byte vs float
        false,
        0,
        0
      );
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0]),
        gl.STATIC_DRAW
      );

      console.log('Initialized GL Renderer.');
    }
  };

  private createShader = (
    gl: WebGL2RenderingContext,
    type: number,
    source: string
  ): WebGLShader => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return -1;
  };

  private createProgram = (
    gl: WebGL2RenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ): WebGLProgram => {
    const program: WebGLProgram = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return -1;
  };

  public stop = (): void => {
    if (this.timeout) window.cancelAnimationFrame(this.timeout);
  };

  public setPPU = (ppu: PPU): void => {
    this.ppu = ppu;
  };

  public start = (): void => {
    this.timeout = window.requestAnimationFrame(this.draw);
  };

  public unpackTexture = (): void => {
    // unpack the image data from 2bit pp to 4byte pp
    const {gl, colorScheme, ppu} = this;
    const data = new Uint8Array(92160);
    const offset = this.ppu.scrollX & 7;
    let pointer = 0;
    for (let y = 0; y < GLRenderer.screenHeight; y++) {
      const scanline = ppu.pixelMap[y];
      let x;
      let color;
      for (x = 7 - offset; x >= 0; x--, pointer += 4) {
        color = colorScheme[ppu.paletteMap[(scanline[0] >> (x * 2)) & 0b11]];
        data[pointer] = color[0];
        data[pointer + 1] = color[1];
        data[pointer + 3] = color[3];
        data[pointer + 2] = color[2];
      }
      for (let tile = 1; tile < 20; tile++) {
        for (x = 7; x >= 0; x--, pointer += 4) {
          color =
            colorScheme[ppu.paletteMap[(scanline[tile] >> (x * 2)) & 0b11]];
          data[pointer] = color[0];
          data[pointer + 1] = color[1];
          data[pointer + 2] = color[2];
          data[pointer + 3] = color[3];
        }
      }
      for (x = 8 - offset; x < 8; x++, pointer += 4) {
        color = colorScheme[ppu.paletteMap[(scanline[20] >> (x * 2)) & 0b11]];
        data[pointer] = color[0];
        data[pointer + 1] = color[1];
        data[pointer + 2] = color[2];
        data[pointer + 3] = color[3];
      }
    }
    gl.texSubImage2D(
      gl.TEXTURE_2D,
      0,
      0,
      0,
      GLRenderer.screenWidth,
      GLRenderer.screenHeight,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array(data)
    );
  };

  public draw = (): void => {
    const {gl} = this;
    this.unpackTexture();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    this.timeout = window.requestAnimationFrame(this.draw);
  };
}

export default GLRenderer;
