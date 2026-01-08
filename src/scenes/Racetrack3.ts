import CanvasRenderer from '../CanvasRenderer.js';
import Vector2 from '../Vector2.js';
import KeyListener from '../KeyListener.js';
import Scene from './Scene.js';
import RacetrackScene from './RacetrackScene.js';
import ScenePause from './ScenePause.js';
import ScenePitstop from './ScenePitstop.js';
import SceneFinish from './SceneFinish.js';
import RaceResult from '../data/RaceResult.js';
import Grid from '../Grid.js';
import Camera from '../Camera.js';

export default class Racetrack3 extends RacetrackScene {
  private camera: Camera;

  private pause: boolean;

  private pitstop: boolean;

  private totalTime: number;

  private pitstops: number;

  private pitstopPenaltyTime: number;

  public constructor(boardSize: Vector2, canvas: HTMLCanvasElement, grid: Grid) {
    super(boardSize, canvas, grid);
    this.camera = new Camera(canvas.width, canvas.height, this.worldWidth, this.worldHeight);
    this.background = CanvasRenderer.loadNewImage('assets/racetracks/race3.png');
    this.pause = false;
    this.pitstop = false;

    this.totalTime = 0;
    this.pitstops = 0;
    this.pitstopPenaltyTime = 0;

    this.setCarStart(canvas.width * 0.75, canvas.height * 1.08, -1.6);

    this.loadTriggers();
  }

  private loadTriggers(): void {
    // Hardcoded from race1UPDATEDtest.json
    this.checkpoints = [
      { x: 64, y: 896, width: 192, height: 64, index: 0 },
      { x: 256, y: 64, width: 64, height: 192, index: 1 },
      { x: 384, y: 640, width: 192, height: 64, index: 2 },
      { x: 1280, y: 576, width: 192, height: 64, index: 3 },
      { x: 1024, y: 192, width: 192, height: 64, index: 4 },
      { x: 1408, y: 0, width: 64, height: 192, index: 5 },
      { x: 1664, y: 512, width: 192, height: 64, index: 6 }
    ];
    this.finish = { x: 896, y: 960, width: 64, height: 320 };
  }

  /**
   * Processes the input
   *
   * @param keyListener The keylistener which is being used
   */
  public override processInput(keyListener: KeyListener): void {
    this.processCarInput(keyListener);

    // Timer start
    this.startRaceIfMoving(keyListener);

    // Reset race with R
    if (keyListener.keyPressed(KeyListener.KEY_R)) {
      this.resetRace();
    }

    // Pause the race with ESC
    if (keyListener.keyPressed(KeyListener.KEY_ESC)) {
      this.pause = true;
    }

    // Changes the scene to ScenePitstop when P is pressed
    // (needs to activate with collision in next version)
    if (keyListener.keyPressed(KeyListener.KEY_P)) {
      this.pitstop = true;
    }
  }

  /**
   * Updates the Racetrack1 scene
   * @param delta elapsed time
   * @returns time elapsed
   */
  public override update(delta: number): void {
    this.car.update(delta, this.canvas, this.grid);

    this.checkTriggers(); //for the lapcount

    this.stopwatch.update(delta);

    // Stopwatch stops when LapCount = 5
    if (this.isFinished() && !this.finished) {
      this.finished = true;
      this.stopwatch.stop();

      this.totalTime = this.stopwatch.getTime();
    }
  }

  public override getNextScene(): Scene | null {
    if (this.pause) {
      this.pause = false;
      return new ScenePause(this.boardSize, this.canvas, this);
    }

    if (this.pitstop) {
      this.pitstop = false;
      this.pauseTimer();
      return new ScenePitstop(this.boardSize, this.canvas, this);
    }
    if (this.car.pitstopTriggered) {
      this.car.pitstopTriggered = false;
      this.pitstop = true;
    }
    if (this.car.getHealth().carIsLow()) {
      this.pitstop = true;
    }
    if (this.finished) {
      const raceResult: RaceResult = {
        totalTime: this.totalTime,
        pitstopCount: this.pitstops,
        pitstopPenaltyTime: this.pitstopPenaltyTime,
      };

      return new SceneFinish(
        this.boardSize,
        this.canvas,
        raceResult,
        () => new Racetrack3(this.boardSize, this.canvas, this.grid)
      );
    }

    return null;
  }

  /**
   * Renders everything in Racetrack1
   *
   * @param canvas the canvas it needs to be rendered on
   */
  public override render(canvas: HTMLCanvasElement): void {
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    // Renders the background
    ctx.drawImage(this.background, 0, 0);

    // Renders the car
    this.car.render(canvas);
  }

  /**
   * Render the lapcount in the left corner of the screen
   * @returns /
   */
  public renderLapcount(): void {
    const ctx: CanvasRenderingContext2D | null = this.canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Laps: ${this.getLaps()} / ${this.getMaxLaps()}`, 25, 40);
  }

  /**
   * Render the stopwatch in the right corner of the screen
   * @returns /
   */
  public renderTimer(): void {
    const ctx: CanvasRenderingContext2D | null = this.canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(this.stopwatch.getFormatted(), this.canvas.width - 25, 40);
  }
}
