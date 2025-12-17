import CanvasRenderer from '../CanvasRenderer.js';
import Vector2 from '../Vector2.js';
import KeyListener from '../KeyListener.js';
import Scene from './Scene.js';
import RacetrackScene from './RacetrackScene.js';
import ScenePause from './ScenePause.js';
import ScenePitstop from './ScenePitstop.js';
import Camera from '../Camera.js';

export default class Racetrack1 extends RacetrackScene {
  private pause: boolean;

  private pitstop: boolean;

  private camera: Camera;

  public constructor(boardSize: Vector2, canvas: HTMLCanvasElement) {
    super(boardSize, canvas);
    this.pause = false;
    this.pitstop = false;

    this.camera = new Camera();

    this.background = CanvasRenderer.loadNewImage('./assets/racetrack1Demo.png');
    this.setCarStart(canvas.width * 0.5, canvas.height * 0.285, 1.085);
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
    this.car.update(delta, this.canvas);

    this.camera.follow(this.car.getPosX(), this.car.getPosY(), this.canvas);

    this.stopwatch.update(delta);

    // Stopwatch stops when LapCount = 3
    if (this.isFinished()) {
      this.stopwatch.stop();
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
    ctx.drawImage(this.background,
      -this.camera.x, -this.camera.y,
      this.worldWidth, this.worldHeight
    );

    // Renders the car
    this.car.render(canvas);

    // Colour and font the lapcount/timer
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';

    // Render the lapcount
    ctx.textAlign = 'left';
    ctx.fillText(`Laps: ${this.getLaps()} / ${this.getMaxLaps()}`, 20, 40);

    // Renders the timer
    ctx.textAlign = 'right';
    ctx.fillText(this.stopwatch.getFormatted(), canvas.width - 20, 40);
  }
}
