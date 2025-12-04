import CanvasRenderer from './CanvasRenderer.js';

export default class Car {
  private image: HTMLImageElement;

  private posX: number;

  private posY: number;

  private maxX: number;

  private speed: number = 2;

  private movingLeft: boolean = false;

  private movingRight: boolean = false;

  private movingUp: boolean = false;

  private movingDown: boolean = false;

  public constructor (maxX: number, maxY: number) {
    this.image = CanvasRenderer.loadNewImage('./assets/car1.png');
    this.maxX = maxX;
    this.posX = (maxX / 2) - (this.image.width / 2);
    this.posY = maxY - this.image.height;
  }

  public moveLeft(): void {
    this.movingLeft = true;
  }

  public moveRight(): void {
    this.movingRight = true;
  }

  public moveUp(): void {
    this.movingUp = true;
  }

  public moveDown(): void {
    this.movingDown = true;
  }

  public update(delta: number): void {
    if(this.movingLeft) {
      this.posX -= delta * 0.5 * this.speed;
      this.movingLeft = false;
    }
    if(this.movingRight) {
      this.posX += delta * 0.5 * this.speed;
      this.movingRight = false;
    }
    if(this.movingUp) {
      this.posY += delta * 0.5 * this.speed;
      this.movingRight = false;
    }
    if(this.movingDown) {
      this.posY -= delta * 0.5 * this.speed;
      this.movingRight = false;
    }

  }

  public render(canvas: HTMLCanvasElement): void {
    CanvasRenderer.drawImage(canvas, this.image, this.posX, this.posY);
  }

  public getPosX(): number {
    return this.posX;
  }

  public getPosY(): number {
    return this.posY;
  }

  public getWidth(): number {
    return this.image.width;
  }

  public getHeight(): number {
    return this.image.height;
  }
}
