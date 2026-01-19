import CanvasRenderer from '../CanvasRenderer.js';
import Vector2 from '../Vector2.js';
import KeyListener from '../KeyListener.js';
import MouseListener from '../MouseListener.js';
import Scene from './Scene.js';
import RacetrackScene, { AnswerBoxSpawn } from './RacetrackScene.js';
import ScenePause from './ScenePause.js';
import ScenePitstop from './ScenePitstop.js';
import SceneFinish from './SceneFinish.js';
import RaceResult from '../data/RaceResult.js';
import Grid from '../Grid.js';
import { verkleinwoorden } from '../questions/verkleinwoorden.js';


export default class Racetrack1 extends RacetrackScene {
  public constructor(boardSize: Vector2, canvas: HTMLCanvasElement, grid: Grid) {
    super(boardSize, canvas, grid);

    this.trackBackground = CanvasRenderer.loadNewImage('./assets/racetracks/race1.png');
    this.background = this.trackBackground;

    this.setCarStart(800, 925, -1.57);
    this.loadTriggers();

    this.setQuestionData(verkleinwoorden.normal);
  }

  private loadTriggers(): void {
    // Hardcoded from race1.json
    this.checkpoints = [
      { x: 128, y: 320, width: 256, height: 64, index: 0 },
      { x: 832, y: 320, width: 64, height: 256, index: 1 },
      { x: 1536, y: 64, width: 64, height: 256, index: 2 },
      { x: 1280, y: 768, width: 64, height: 320, index: 3 }
    ];
    this.finish = { x: 704, y: 832, width: 64, height: 384 };
  }

  /**
   * Processes the input
   *
   * @param keyListener The keylistener which is being used
   */
  public override processInput(keyListener: KeyListener,
    mouseListener: MouseListener
  ): void {
    this.processCarInput(keyListener);

    // Timer start
    this.startRaceIfMoving(keyListener);


    // Pause the race with ESC
    if (keyListener.keyPressed(KeyListener.KEY_ESC)) {
      this.pause = true;
    }

    // Update the pausebutton
    this.updatePauseButton(
      mouseListener.getMousePosition(),
      mouseListener.buttonPressed(MouseListener.BUTTON_LEFT)
    );
  }

  /**
   * Updates the Racetrack1 scene
   * @param delta elapsed time
   * @returns time elapsed
   */
  public override update(delta: number): void {
    if (this.finished) {
      return;
    }

    this.car.update(delta, this.canvas, this.grid, this.answerBoxes);

    this.checkTriggers(); //for the lapcount

    this.stopwatch.update(delta);

    if (this.pauseClicked) {
      this.pause = true;
      this.pauseClicked = false;
    }

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
      this.pitstops += 1;
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
        () => new Racetrack1(this.boardSize, this.canvas, this.grid),
        this.trackBackground
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

    for (const box of this.answerBoxes) {
      CanvasRenderer.drawAnswerBox(
        canvas,
        box.x - this.camera.position.x,
        box.y - this.camera.position.y,
        box.width,
        box.height,
        'gold',
        `${box.index + 1}`,
        'white',
        '20px Arial'
      );
    }
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

  protected override getAnswerBoxSpawns(): AnswerBoxSpawn[] {
    void this.boardSize; // Dummy to fix ES-Lint error

    return [
      { x: 160, y: 600, direction: 'horizontal' },
      { x: 1630, y: 375, direction: 'horizontal' },
      { x: 940, y: 360, direction: 'vertical' },
    ];
  }
}
