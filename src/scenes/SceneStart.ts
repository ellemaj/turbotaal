import CanvasRenderer from '../CanvasRenderer.js';
import KeyListener from '../KeyListener.js';
import Vector2 from '../Vector2.js';
import SceneTrackSelection from './SceneTrackSelection.js';
import SceneShop from './SceneShop.js';
import Scene from './Scene.js';

export default class SceneStart extends Scene {
  private goToTrackSelection: boolean;

  private goToShop: boolean;

  public constructor(boardSize: Vector2) {
    super(boardSize);
    this.goToTrackSelection = false;
    this.goToShop = false;
  }

  /**
   * Starts the game when space is pressed
   *
   * @param keyListener Looks is the space key is being pressed
   */
  public override processInput(keyListener: KeyListener): void {
    if (keyListener.keyPressed(KeyListener.KEY_SPACE)) {
      this.goToTrackSelection = true;
    } else if (keyListener.keyPressed(KeyListener.KEY_S)) {
      this.goToShop = true;
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
    if (this.goToTrackSelection) {
      return new SceneTrackSelection(this.boardSize);
    } else if (this.goToShop) {
      return new SceneShop(this.boardSize);
    }
    return null;
  }

  /**
   * Renders the text on the screen.
   *
   * @param canvas the canvas it needs to be rendered on
   */
  public override render(canvas: HTMLCanvasElement): void {
    CanvasRenderer.writeText(
      canvas,
      'Press SPACE to select a track.',
      this.boardSize.x / 2,
      this.boardSize.y / 2 - 50);

    CanvasRenderer.writeText(
      canvas,
      'Press S for the shop menu.',
      this.boardSize.x / 2,
      this.boardSize.y / 2);
  }
}
