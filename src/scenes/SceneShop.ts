import CanvasRenderer from '../CanvasRenderer.js';
import KeyListener from '../KeyListener.js';
import Vector2 from '../Vector2.js';
import SceneSkins from './SceneSkins.js';
import ScenePowerups from './ScenePowerups.js';
import Scene from './Scene.js';
import SceneStart from './SceneStart.js';

export default class SceneShop extends Scene {
  private shopSkins: boolean;

  private shopPowerups: boolean;

  private goBack: boolean;

  public constructor(boardSize: Vector2, canvas: HTMLCanvasElement) {
    super(boardSize, canvas);
    this.shopSkins = false;
    this.shopPowerups = false;
    this.goBack = false;
  }

  /**
   * Starts the game when space is pressed
   *
   * @param keyListener Looks is the space key is being pressed
   */
  public override processInput(keyListener: KeyListener): void {
    // Go to skins when space is pressed
    if (keyListener.keyPressed(KeyListener.KEY_SPACE)) {
      this.shopSkins = true;
    }

    // Go to powerups when P is pressed
    if (keyListener.keyPressed(KeyListener.KEY_P)) {
      this.shopPowerups = true;
    }

    // Go back to start when ESC is pressed
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
    if (this.shopSkins) {
      return new SceneSkins(this.boardSize, this.canvas);
    }

    if (this.shopPowerups) {
      return new ScenePowerups(this.boardSize, this.canvas);
    }

    if (this.goBack) {
      return new SceneStart(this.boardSize, this.canvas);
    }
    return null;
  }

  /**
   * //
   *
   * @param canvas the canvas it needs to be rendered on
   */
  public override render(canvas: HTMLCanvasElement): void {
    CanvasRenderer.writeText(
      canvas,
      'Welcome to the shop!',
      this.boardSize.x / 2,
      this.boardSize.y / 2 - 50);

    CanvasRenderer.writeText(
      canvas,
      'Press space for the skins-page, and press P voor the powerup-page',
      this.boardSize.x / 2,
      this.boardSize.y / 2);
  }
}
