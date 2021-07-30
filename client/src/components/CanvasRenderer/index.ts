import benchmark, {benchmarksEnabled} from 'helpers/Performance';
import {sample} from 'lodash';
import PPU from 'PPU/index';

const testAnimation = {
  x: 0,
  y: 0,
};

const colorSchemes = {
  default: {
    0: [255, 255, 255, 255],
    1: [170, 170, 170, 255],
    2: [85, 85, 85, 255],
    3: [0, 0, 0, 255],
  },
  classic: {
    0: [155, 188, 15, 255],
    2: [139, 172, 15, 255],
    3: [48, 98, 48, 255],
    4: [16, 56, 16, 255],
  },
};

class CanvasRenderer {
  private timeout!: number;
  private ppu!: PPU;
  private image!: ImageData;
  private canvasOffscreen!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D;
  private offscreenContext!: CanvasRenderingContext2D;
  public initialized = false;
  public colorScheme: ColorScheme = colorSchemes.default;
  // how many pixels should an individual image pixel take up? e.g. NxN
  private scaleFactor = 1;
  public static screenWidth = 160;
  public static screenHeight = 144;
  public fps = 60;

  constructor() {
    if (benchmarksEnabled) {
      this.setPixel = benchmark<CanvasRenderer>(this, 'setPixel');
      this.draw = benchmark<CanvasRenderer>(this, 'draw');
    }
  }

  public initialize = (canvas: HTMLCanvasElement, scaleFactor = 1): void => {
    if (canvas && !this.initialized) {
      this.scaleFactor = scaleFactor;
      this.context = <CanvasRenderingContext2D>canvas.getContext('2d');
      this.canvasOffscreen = document.createElement('canvas');
      this.canvasOffscreen.width = CanvasRenderer.screenWidth;
      this.canvasOffscreen.height = CanvasRenderer.screenHeight;
      this.offscreenContext = <CanvasRenderingContext2D>(
        this.canvasOffscreen.getContext('2d')
      );
      this.image = this.offscreenContext.createImageData(
        CanvasRenderer.screenWidth * this.scaleFactor,
        CanvasRenderer.screenHeight * this.scaleFactor
      );
      this.initialized = true;
      // this.timeout = window.requestAnimationFrame(this.draw);
    }
  };

  public setPPU = (ppu: PPU): void => {
    this.ppu = ppu;
  };

  public setPixel = (x: number, y: number, color: RGB): void => {
    x *= this.scaleFactor;
    y *= this.scaleFactor;
    for (let startX = x; startX < x + this.scaleFactor; startX++) {
      for (let startY = y; startY < y + this.scaleFactor; startY++) {
        const scaledY = startY * this.scaleFactor;
        const scaledX = startX;
        const offset = scaledY * CanvasRenderer.screenWidth * 4 + scaledX * 4;

        this.image.data[offset] = color[0];
        this.image.data[offset + 1] = color[1];
        this.image.data[offset + 2] = color[2];
        this.image.data[offset + 3] = color[3];
      }
    }
  };

  public draw = (): void => {
    for (let y = 0; y < CanvasRenderer.screenHeight; y++) {
      for (let x = 0; x < CanvasRenderer.screenWidth; x++) {
        this.setPixel(x, y, this.colorScheme[this.ppu.pixelMap[y][x]]);
      }
    }
    this.offscreenContext.putImageData(this.image, 0, 0);
    // this.context.drawImage(this.canvasOffscreen, 0, 0);

    // setTimeout(this.draw, 100);
    // this.context.drawImage(this.image.getImage, 0, 0);
    // this.timeout = window.requestAnimationFrame(this.draw);
  };

  public drawOnScreen = (): void => {
    this.context.drawImage(this.canvasOffscreen, 0, 0);
    // setTimeout(this.drawOnScreen, 100);
  };

  public testAnimation = (): void => {
    testAnimation.x += 1;
    if (testAnimation.x === CanvasRenderer.screenWidth) {
      testAnimation.y += 1;
      testAnimation.x = 0;
    }
    if (testAnimation.y === CanvasRenderer.screenHeight) {
      testAnimation.x = 0;
      testAnimation.y = 0;
    }
    this.setPixel(
      testAnimation.x,
      testAnimation.y,
      <RGB>sample(this.colorScheme)
    );
  };
}

export default CanvasRenderer;
