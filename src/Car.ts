import CanvasRenderer from './CanvasRenderer.js';
import Vector2 from './Vector2.js';

export default class Car {
  private image: HTMLImageElement;

  private posX: number;

  private posY: number;

  private turnSpeed: number = 3;

  private rotation: number = 0;

  private maxSpeed: number = 20;

  private movingLeft: boolean = false;

  private movingRight: boolean = false;

  public movingUp: boolean = false;

  private movingDown: boolean = false;

  private pivot: Vector2;

  private speed: number = 0;

  public constructor(maxX: number, maxY: number) {
    this.image = CanvasRenderer.loadNewImage('./assets/car2.png');
    this.posX = (maxX / 2) - (this.image.width / 2);
    this.posY = maxY - this.image.height;
    this.pivot = new Vector2(this.image.width / 2, this.image.height / 2);
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

  public update(delta: number, canvas: HTMLCanvasElement): void {
    if (this.movingLeft) {
      this.rotation -= (Math.PI * (delta / 10) / 180);
      this.movingLeft = false;
    }
    if (this.movingRight) {
      this.rotation += (Math.PI * (delta / this.speed) / 180);
      this.movingRight = false;
    }
    if (this.movingUp) {
      this.speed += 0.005 * delta;
      this.posX -= Math.cos(this.rotation + Math.PI / 2) * this.speed;
      this.posY -= Math.sin(this.rotation + Math.PI / 2) * this.speed;
    } else {
      
    }
    if (this.movingDown) {
      this.speed = 0.1 * delta;
      this.posX += Math.cos(this.rotation + Math.PI / 2) * this.speed;
      this.posY += Math.sin(this.rotation + Math.PI / 2) * this.speed;
      this.movingDown = false;
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
  }

  public render(canvas: HTMLCanvasElement): void {
    CanvasRenderer.drawImage(canvas, this.image, this.posX, this.posY, this.rotation);
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
