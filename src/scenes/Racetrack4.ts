import CanvasRenderer from '../CanvasRenderer.js';
import Vector2 from '../Vector2.js';
// import MouseListener from '../MouseListener.js';
import KeyListener from '../KeyListener.js';
import Scene from './Scene.js';
import RacetrackScene, { AnswerBoxSpawn } from './RacetrackScene.js';
import SceneTrackSelection from './SceneTrackSelection.js';
import Grid from '../Grid.js';

export default class Racetrack4 extends RacetrackScene {
  private goBack: boolean;

  public constructor(boardSize: Vector2, canvas: HTMLCanvasElement, grid: Grid) {
    super(boardSize, canvas, grid);
    this.goBack = false;
    this.background = CanvasRenderer.loadNewImage('./assets/background.png'); // Change to the right background!
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

    // Changes the scene to SceneTrackSelection when ESC is being pressed
    if (keyListener.keyPressed(KeyListener.KEY_ESC)) {
      this.goBack = true;
    }
  }

  /**
   * Updates the stopwatch with the elapsed time
   * @param delta elapsed time
   * @returns time elapsed
   */
  public override update(delta: number): void {
    this.car.update(delta, this.canvas, this.grid, this.answerBoxes);

    this.stopwatch.update(delta);

    // Stopwatch stops when LapCount = 3
    if (this.isFinished()) {
      this.stopwatch.stop();
    }
  }

  public override getNextScene(): Scene | null {
    if (this.goBack) {
      return new SceneTrackSelection(this.boardSize, this.canvas);
    }
    return null;
  }

  protected override setCarStart(): void { // Change the startposition of the car!
    this.car.setStartPosition(
      this.canvas.width * 0.5,
      this.canvas.height * 0.5,
      1
    );
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
    } // Renders the background
    ctx.drawImage(this.background, 0, 0, canvas.width, canvas.height);

    this.car.render(canvas);

    // Renders the text on the screen
    CanvasRenderer.writeText(
      canvas,
      'Racetrack 4', //Press escape to go back to the track selection.',
      this.boardSize.x / 2,
      this.boardSize.y / 2);

    // Renders the lapcount
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Laps: ${this.getLaps()} / ${this.getMaxLaps()}`, 20, 40);

    // Renders the timer
    ctx.textAlign = 'right';
    ctx.fillText(this.stopwatch.getFormatted(), canvas.width - 20, 40);
  }

  protected override getAnswerBoxSpawns(): AnswerBoxSpawn[] {
    return [
      { x: 160, y: 600, direction: 'horizontal' },
      { x: 1630, y: 375, direction: 'horizontal' },
      { x: 612, y: 265, direction: 'horizontal' },
    ];
  }
}
