import CanvasRenderer from '../CanvasRenderer.js';
import Vector2 from '../Vector2.js';
// import MouseListener from '../MouseListener.js';
import KeyListener from '../KeyListener.js';
import Scene from './Scene.js';
import RacetrackScene from './RacetrackScene.js';
import SceneTrackSelection from './SceneTrackSelection.js';

export default class Racetrack1 extends RacetrackScene {
  private goBack: boolean;

  public constructor(boardSize: Vector2, canvas: HTMLCanvasElement) {
    super(boardSize, canvas);
    this.goBack = false;
    this.background = CanvasRenderer.loadNewImage('./assets/racetrack1Demo.png');
  }

  /**
   * Processes the input
   *
   * @param keyListener The keylistener which is being used
   */
  public override processInput(keyListener: KeyListener): void {
    // Starts the race when moved for the first time
    this.startRaceIfMoving(keyListener);

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
    this.stopwatch.update(delta);

    // Stopwatch stops when LapCount = 3
    if (this.isFinished()) {
      this.stopwatch.stop();
    }
  }

  public override getNextScene(): Scene | null {
    if(this.goBack){
      return new SceneTrackSelection(this.boardSize, this.canvas);
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
    } // Renders the background
    ctx.drawImage(this.background, 0, 0, canvas.width, canvas.height);

    // Renders the text on the screen
    CanvasRenderer.writeText(
      canvas,
      'Racetrack 1.', //Press escape to go back to the track selection.',
      this.boardSize.x / 2,
      this.boardSize.y / 2);

    // Renders the lapcount
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Laps: ${this.getLaps()} / ${this.getMaxLaps()}`, 20, 40);

    ctx.textAlign = 'right';
    ctx.fillText(this.stopwatch.getFormatted(), canvas.width - 20, 40);
  }
}
