import Scene from './Scene.js';
import Vector2 from '../Vector2.js';
import Stopwatch from '../Stopwatch.js';
import KeyListener from '../KeyListener.js';
import Car from '../Car.js';
import Grid from '../Grid.js';
import Question from '../Question.js';
import PlayerData from '../data/PlayerData.js';
import { AnswerBox } from '../data/Answerbox.js';

export type AnswerBoxSpawn = {
  x: number,
  y: number,
  direction: 'horizontal' | 'vertical';
};

export default abstract class RacetrackScene extends Scene {
  private laps: number = 0;

  private get maxLaps(): number {
    return PlayerData.getMaxLaps();
  }

  protected finished: boolean = false;

  protected stopwatch: Stopwatch = new Stopwatch();

  protected raceStarted: boolean = false;

  protected car: Car;

  protected question: Question;

  protected checkpoints: {
    x: number, y: number,
    width: number, height: number, index: number
  }[] = [];

  protected finish: { x: number, y: number, width: number, height: number } | null = null;

  protected passedCheckpoints: Set<number> = new Set();

  protected worldWidth: number = this.canvas.width * 2;

  protected worldHeight: number = this.canvas.height * 2;

  protected grid: Grid;

  protected trackBackground: HTMLImageElement = new Image();

  protected answerBoxes: AnswerBox[] = [];

  public constructor(boardSize: Vector2, canvas: HTMLCanvasElement, grid: Grid) {
    super(boardSize, canvas);

    this.car = new Car();
    this.question = new Question();
    this.grid = grid;

    this.createAnswerBoxes();
  }

  // Starts the timer when the player moves for the first time
  protected startRaceIfMoving(keyListener: KeyListener): void {
    const moving: boolean =
      keyListener.isKeyDown(KeyListener.KEY_LEFT) ||
      keyListener.isKeyDown(KeyListener.KEY_A) ||
      keyListener.isKeyDown(KeyListener.KEY_RIGHT) ||
      keyListener.isKeyDown(KeyListener.KEY_D) ||
      keyListener.isKeyDown(KeyListener.KEY_UP) ||
      keyListener.isKeyDown(KeyListener.KEY_W) ||
      keyListener.isKeyDown(KeyListener.KEY_DOWN) ||
      keyListener.isKeyDown(KeyListener.KEY_S);

    if (moving && !this.raceStarted) {
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

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  public getQuestion(): Question {
    return this.question;
  }

  private resetLaps(): void {
    this.laps = 0;
    this.raceStarted = false;
  }

  /**
   * Pauses the stopwatch
   */
  public pauseTimer(): void {
    this.stopwatch.pause();
  }

  /**
   * Resumes the stopwatch
   */
  public resumeTimer(): void {
    this.stopwatch.resume();
  }

  public getFormattedTime(): string {
    return this.stopwatch.getFormatted();
  }

  protected setCarStart(x: number, y: number, rotation: number): void {
    this.car.setStartPosition(x, y, rotation);
  }

  /**
   * checks for collisions with checkpoints and finish line
   */
  protected checkTriggers(): void {
    if (this.finished) {
      return;
    }

    const carPos: Vector2 = this.car.getPosition();
    const carSize: number = 32;

    // check checkpoints
    for (const checkpoint of this.checkpoints) {
      if (!this.passedCheckpoints.has(checkpoint.index) &&
        carPos.x < checkpoint.x + checkpoint.width &&
        carPos.x + carSize > checkpoint.x &&
        carPos.y < checkpoint.y + checkpoint.height &&
        carPos.y + carSize > checkpoint.y) {
        this.passedCheckpoints.add(checkpoint.index);
      }
    }

    // check finish
    if (this.finish &&
      carPos.x < this.finish.x + this.finish.width &&
      carPos.x + carSize > this.finish.x &&
      carPos.y < this.finish.y + this.finish.height &&
      carPos.y + carSize > this.finish.y) {
      // check if all checkpoints have been passed
      const allPassed: boolean = this.checkpoints.every((cp: {
        x: number, y: number,
        width: number, height: number, index: number
      }) => this.passedCheckpoints.has(cp.index));
      if (allPassed) {
        this.addLap();
        this.passedCheckpoints.clear(); //reset for next
      }
    }
  }

  // Resets the stopwatch, car position and lapcount when pressed
  public resetRace(): void {
    this.stopwatch.stop();
    this.stopwatch = new Stopwatch();

    this.resetLaps();
    this.passedCheckpoints.clear();
    this.raceStarted = false;

    this.car.resetPosition(this.canvas);
  }

  public getTrackBackground(): HTMLImageElement {
    return this.trackBackground;
  }

  protected abstract getAnswerBoxSpawns(): AnswerBoxSpawn[];

  protected createAnswerBoxes(): void {
    const boxWidth: number = 40;
    const boxHeight: number = 40;
    const spacing: number = 30;

    this.answerBoxes = [];

    for (const spawn of this.getAnswerBoxSpawns()) {
      for (let i: number = 0; i < 3; i++) {
        this.answerBoxes.push({
          x: spawn.direction === 'horizontal'
            ? spawn.x + i * (boxWidth + spacing)
            : spawn.x,
          y: spawn.direction === 'vertical'
            ? spawn.y + i * (boxHeight + spacing)
            : spawn.y,
          width: boxWidth,
          height: boxHeight,
          index: i,
        });
      }
    }
  }
}
