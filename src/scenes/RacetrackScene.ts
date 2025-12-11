import Scene from './Scene.js';
import Vector2 from '../Vector2.js';
import Stopwatch from '../Stopwatch.js';
import KeyListener from '../KeyListener.js';
import Car from '../Car.js';

export default abstract class RacetrackScene extends Scene {
  private laps: number = 0;

  private maxLaps: number = 3;

  protected stopwatch: Stopwatch = new Stopwatch();

  protected raceStarted: boolean = false;

  protected car: Car;

  public constructor(boardSize: Vector2, canvas: HTMLCanvasElement) {
    super(boardSize, canvas);

    this.car = new Car();
  }

  // Starts the timer when the player moves for the first time
  protected startRaceIfMoving(keyListener: KeyListener): void {
    if (!this.raceStarted &&
      (keyListener.isKeyDown(KeyListener.KEY_LEFT) || keyListener.isKeyDown(KeyListener.KEY_A) ||
        keyListener.isKeyDown(KeyListener.KEY_RIGHT) || keyListener.isKeyDown(KeyListener.KEY_D) ||
        keyListener.isKeyDown(KeyListener.KEY_UP) || keyListener.isKeyDown(KeyListener.KEY_W) ||
        keyListener.isKeyDown(KeyListener.KEY_DOWN) || keyListener.isKeyDown(KeyListener.KEY_S))) {
      this.stopwatch.start();
      this.raceStarted = true;
    }
  }

  protected processCarInput(keyListener: KeyListener): void {
    this.car.movingLeft =
      keyListener.isKeyDown(KeyListener.KEY_LEFT) ||
      keyListener.isKeyDown(KeyListener.KEY_A);

    this.car.movingRight =
      keyListener.isKeyDown(KeyListener.KEY_RIGHT) ||
      keyListener.isKeyDown(KeyListener.KEY_D);

    this.car.movingUp =
      keyListener.isKeyDown(KeyListener.KEY_UP) ||
      keyListener.isKeyDown(KeyListener.KEY_W);

    this.car.movingDown =
      keyListener.isKeyDown(KeyListener.KEY_DOWN) ||
      keyListener.isKeyDown(KeyListener.KEY_S);
  }

  /**
   * Adds the laps
   * For adding a lap in a certain racetrack (for instance 1)
   * you'll need to code: racetrack1.addLap();
   */
  public addLap(): void {
    if (this.laps < this.maxLaps) {
      this.laps += 1;
    }
  }

  public getLaps(): number {
    return this.laps;
  }

  public getMaxLaps(): number {
    return this.maxLaps;
  }

  /**
   * Looks if the player is finished
   * @returns true or false, depends if the player is finished
   */
  public isFinished(): boolean {
    return this.laps >= this.maxLaps;
  }

  public getCar(): Car {
    return this.car;
  }

  private resetLaps(): void {
    this.laps = 0;
    this.raceStarted = false;
  }

  protected setCarStart(x: number, y: number, rotation: number): void {
    this.car.setStartPosition(x, y, rotation);
  }

  public resetRace(): void {
    this.stopwatch.stop();
    this.stopwatch = new Stopwatch();

    this.resetLaps();
    this.raceStarted = false;

    this.car.resetPosition(this.canvas);
  }
}
