import {PPU} from 'PPU/index';

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

  constructor() {}

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
    }
  };

  public render = (): void => {
    this.timeout = window.requestAnimationFrame(this.drawOnScreen);
  };

  public clear = (): void => {
    this.clearScreen();
    if (this.timeout !== null) window.cancelAnimationFrame(this.timeout);
  };

  public setPixel = (x: number, y: number, color: RGBA): void => {
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

  private clearScreen = (): void => {
    this.image = this.offscreenContext.createImageData(
      CanvasRenderer.screenWidth * this.scaleFactor,
      CanvasRenderer.screenHeight * this.scaleFactor
    );
    this.offscreenContext.putImageData(this.image, 0, 0);
    this.context.drawImage(this.canvasOffscreen, 0, 0);
    // this.image.data = new Array(screenHeight * this.scaleFactor)
    //   .fill(0)
    //   .map(y =>
    //     new Array(CanvasRenderer.screenWidth * this.scaleFactor * 4).fill(0)
    //   );
  };

  public buildImage = (): void => {
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
    this.timeout = window.requestAnimationFrame(this.drawOnScreen);
    // setTimeout(this.drawOnScreen, 100);
  };
}

export default CanvasRenderer;
