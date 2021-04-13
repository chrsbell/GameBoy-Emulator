import benchmark, {benchmarksEnabled} from '../Performance';

export type RGB = Array<number>;

export const Colors = {
  white: [255, 255, 255, 255] as RGB,
  lightGray: [170, 170, 170, 255] as RGB,
  darkGray: [85, 85, 85, 255] as RGB,
  black: [0, 0, 0, 255] as RGB,
};

function scaleImageData(
  ctx: CanvasRenderingContext2D,
  imageData: ImageData,
  scale: number
) {
  const scaled = ctx.createImageData(
    imageData.width * scale,
    imageData.height * scale
  );
  const subLine = ctx.createImageData(scale, 1).data;
  for (let row = 0; row < imageData.height; row++) {
    for (let col = 0; col < imageData.width; col++) {
      const sourcePixel = imageData.data.subarray(
        (row * imageData.width + col) * 4,
        (row * imageData.width + col) * 4 + 4
      );
      for (let x = 0; x < scale; x++) subLine.set(sourcePixel, x * 4);
      for (let y = 0; y < scale; y++) {
        const destRow = row * scale + y;
        const destCol = col * scale;
        scaled.data.set(subLine, (destRow * scaled.width + destCol) * 4);
      }
    }
  }

  return scaled;
}

class CanvasRenderer {
  public fps = 60;
  private image!: ImageData;
  private context!: CanvasRenderingContext2D;
  private _initialized = false;
  public get initialized() {
    return this._initialized;
  }
  public set initialized(value) {
    this._initialized = value;
  }
  public screenWidth = 160;
  public screenHeight = 144;

  public constructor() {
    if (benchmarksEnabled) this.draw = benchmark(this.draw.bind(this));
  }

  public initialize(canvas: HTMLCanvasElement) {
    if (canvas && !this.initialized) {
      this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
      this.image = this.context.createImageData(
        this.screenWidth,
        this.screenHeight
      );
      this.initialized = true;
    }
  }

  public setPixel(x: number, y: number, shade: RGB): void {
    const offset = y * 4 * this.screenWidth + x * 4;
    this.image.data[offset] = shade[0];
    this.image.data[offset + 1] = shade[1];
    this.image.data[offset + 2] = shade[2];
    this.image.data[offset + 3] = shade[3];
  }

  public draw() {
    // const unscaled = this.context.getImageData(
    //   0,
    //   0,
    //   this.screenWidth,
    //   this.screenHeight
    // );
    this.context.putImageData(
      scaleImageData(this.context, this.image, 5),
      0,
      0
    );
    // this.context.putImageData(this.image, 0, 0);
    // this.context.scale(30, 30);
    // this.context.drawImage(
    //   this.context.canvas,
    //   this.screenWidth,
    //   this.screenHeight
    // );
  }
}

export default new CanvasRenderer();
