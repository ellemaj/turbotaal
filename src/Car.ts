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

}
