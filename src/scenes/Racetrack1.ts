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
    this.background = CanvasRenderer.loadNewImage('./assets/racetrack1Demo.png'); //verander in de goede filename!
  }

  /**
   * Changes the scene to SceneTrackSelection when ESC is being pressed
   *
   * @param keyListener The keylistener which is being used
   */
  public override processInput(keyListener: KeyListener): void {
    if (keyListener.keyPressed(KeyListener.KEY_ESC)) {
      this.goBack = true;
    }
  }

  /**
   * /
   * @param delta /
   * @returns /
   */
  public override update(delta: number): void {
    return;
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
  }
}
