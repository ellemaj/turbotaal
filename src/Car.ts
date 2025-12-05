<<<<<<< HEAD
import Vector2 from "./Vector2.js";
import KeyListener from "./KeyListener.js";

export default class Car {
  private velocity: Vector2;
  private position: Vector2;
  private acceleration: Vector2;
  private movingDirection: Vector2;
  private keyListener: KeyListener;
  private accSpeed: number = 0.2;
  private accLeft: number = -0.1;
  private accRight: number = 0.1;
  private accBackwards: number = -0.1;
  private maxSpeed: number = 10;

  public constructor() {
    this.velocity = new Vector2(1, 1);
    this.position = new Vector2(30, 30);
    this.acceleration = new Vector2(0, 0);
    this.keyListener = new KeyListener;
    this.movingDirection = new Vector2(0, 0);

  }
  public accelerateForward() {
    this.acceleration.add(new Vector2(0, this.accSpeed));
  }
  public accelerateLeft() {
    this.acceleration.add(new Vector2(this.accLeft, 0))
  }
  public accelerateRight() {
    this.acceleration.add(new Vector2(this.accRight, 0))
  }
  public brakeOrGoBackwards() {
    this.acceleration.add(new Vector2(0, this.accBackwards))
  }
  public CarMoves() {
    if (this.keyListener.isKeyDown('ArrowUp')) {
      this.accelerateForward;
    }
    else if (this.keyListener.isKeyDown('ArrowDown')) {

    }
    else if (this.keyListener.isKeyDown('ArrowRight')) {
      this.accelerateRight
    }
    else if (this.keyListener.isKeyDown('ArrowLeft')) {
      this.accelerateLeft
    }
  }

=======
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
>>>>>>> origin
}
