import CanvasRenderer from '../CanvasRenderer.js';
import Vector2 from '../Vector2.js';
import KeyListener from '../KeyListener.js';
import Scene from './Scene.js';
import RacetrackScene, { AnswerBoxSpawn } from './RacetrackScene.js';
import ScenePause from './ScenePause.js';
import ScenePitstop from './ScenePitstop.js';
import SceneFinish from './SceneFinish.js';
import RaceResult from '../data/RaceResult.js';
import Grid from '../Grid.js';
import { werkwoordspelling } from '../questions/werkwoordspelling.js';
import MouseListener from '../MouseListener.js';

export default class Racetrack2 extends RacetrackScene {
  public constructor(boardSize: Vector2, canvas: HTMLCanvasElement, grid: Grid) {
    super(boardSize, canvas, grid);

    this.trackBackground = CanvasRenderer.loadNewImage('./assets/racetracks/race2.png');
    this.background = this.trackBackground;

    this.setCarStart(900, 250, 1.58);
    this.loadTriggers();

    this.setQuestionData(werkwoordspelling.normal);
  }

  private loadTriggers(): void {
    // Hardcoded from race2UPDATED.json
    this.checkpoints = [
      { x: 1664, y: 512, width: 192, height: 64, index: 0 },
      { x: 1088, y: 1024, width: 64, height: 192, index: 1 },
      { x: 448, y: 896, width: 192, height: 64, index: 2 },
      { x: 64, y: 1024, width: 192, height: 64, index: 3 },
      { x: 64, y: 384, width: 192, height: 64, index: 4 }
    ];
    this.finish = { x: 960, y: 64, width: 64, height: 320 };
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
        () => new Racetrack2(this.boardSize, this.canvas, this.grid),
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

  protected override getAnswerBoxSpawns(): AnswerBoxSpawn[] {
    return [
      { x: 70, y: 900, direction: 'horizontal' },
      { x: 1222, y: 950, direction: 'horizontal' },
      { x: 612, y: 198, direction: 'vertical' },
    ];
  }
}
