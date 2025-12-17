import CanvasRenderer from './CanvasRenderer.js';
import Camera from './Camera.js';

export default abstract class CanvasItem {
  protected image: HTMLImageElement;

  protected posX: number;

  protected posY: number;

  public constructor() {
    this.image = new Image;
    this.posX = 0;
    this.posY = 0;
  }

  public getPosX(): number {
    return this.posX;
  }

  public getPosY(): number {
    return this.posY;
  }

  public getWidth(): number {
    if (this.image.src === '') {
      throw new Error(`${this.constructor.name}: Image not loaded`);
    }
    return this.image.width;
  }

  public getHeight(): number {
    if (this.image.src === '') {
      throw new Error(`${this.constructor.name}: Image not loaded`);
    }
    return this.image.height;
  }

  /**
   * Render shit on the canvas
   * @param canvas Canvas it renders to
   */
  public render(canvas: HTMLCanvasElement): void {
    if (this.image.src === '') {
      throw new Error(`${this.constructor.name}: Image not loaded`);
    }
    CanvasRenderer.drawImage(canvas, this.image, this.posX, this.posY);
  }
}
