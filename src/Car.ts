import CanvasRenderer from './CanvasRenderer.js';
import CanvasItem from './CanvasItem.js';
//import Vector2 from './Vector2.js';

export default class Car extends CanvasItem {
  private rotation: number = -2;

  private speed: number = 0;

  public maxSpeed: number = 2.5;

  private scale: number = 0.28; // Scaling for the car (1 is standard)

  public movingLeft: boolean = false;

  public movingRight: boolean = false;

  public movingUp: boolean = false;

  public movingDown: boolean = false;

  public turnSpeed: number = 5;

  public constructor() {
    this.image = CanvasRenderer.loadNewImage('./assets/car2.png');

    this.posX = 0; // Standard coordinates, configure the start position in the racetrack scenes
    this.posY = 0;
    this.rotation = 0;
  }

  /**
   * Updates the car
   *
   * @param delta Elapsed time
   * @param canvas The canvas it needs to be rendered on
   */
  public update(delta: number, canvas: HTMLCanvasElement): void {
    // Movement
    if (this.movingLeft && this.speed != 0) {
      this.rotation -= (Math.PI * (delta / this.turnSpeed) / 180);
      this.movingLeft = false;
    }
    if (this.movingRight && this.speed != 0) {
      this.rotation += (Math.PI * (delta / this.turnSpeed) / 180);
      this.movingRight = false;
    }
    if (this.movingUp && !this.movingDown) {
      this.speed += 0.005 * delta;
    } else {
      this.speed -= 0.01 * delta;
      if (this.speed < 0) {
        this.speed = 0;
      }
    }
    if (this.movingDown) {
      if (this.speed <= 0) {
        this.speed -= 0.1 * delta;
      } else {
        this.speed -= 0.01 * delta;
      }
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    this.posX -= Math.cos(this.rotation + Math.PI / 2) * this.speed;
    this.posY -= Math.sin(this.rotation + Math.PI / 2) * this.speed;

    // Ensures that te car cannot drive out of your screen
    const carWidth: number = this.image.width * this.scale;
    const carHeight: number = this.image.width * this.scale;

    if (this.posX < 0) {
      this.posX = 0;
    }
    if (this.posY < 0) {
      this.posY = 0;
    }
    if (this.posX + carWidth > canvas.width) {
      this.posX = canvas.width - carWidth;
    }
    if (this.posY + carHeight > canvas.height) {
      this.posY = canvas.height - carHeight;
    }
  }

  /**
   * Render the car
   *
   * @param canvas The canvas the car needs to be rendered on
   */
  public override render(canvas: HTMLCanvasElement): void {
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.save();

    ctx.translate(
      this.posX + (this.image.width * this.scale) / 2,
      this.posY + (this.image.height * this.scale) / 2
    );

    ctx.rotate(this.rotation);
    ctx.scale(this.scale, this.scale);

    ctx.drawImage(
      this.image,
      -(this.image.width / 2),
      -(this.image.height / 2)
    );

    ctx.restore();
  }

  public setScale(scale: number): void {
    this.scale = scale;
  }

  public setStartPosition(x: number, y: number, rotation: number): void {
    this.posX = x;
    this.posY = y;
    this.rotation = rotation;
    this.speed = 0;
  }

  public resetPosition(canvas: HTMLCanvasElement): void {
    this.posX = canvas.width * 0.5;
    this.posY = canvas.height * 0.285;
    this.rotation = 1.085;
    this.speed = 0;
  }
}
