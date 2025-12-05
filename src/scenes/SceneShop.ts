import CanvasRenderer from '../CanvasRenderer.js';
import KeyListener from '../KeyListener.js';
import Vector2 from '../Vector2.js';
import SceneSkins from './SceneSkins.js';
import ScenePowerups from './ScenePowerups.js';
import Scene from './Scene.js';

export default class SceneShop extends Scene {
  private shopSkins: boolean;

  private shopPowerups: boolean;

  public constructor(boardSize: Vector2) {
    super(boardSize);
    this.shopSkins = false;
    this.shopPowerups = false;
  }

  /**
   * Starts the game when space is pressed
   *
   * @param keyListener Looks is the space key is being pressed
   */
  public override processInput(keyListener: KeyListener): void {
    if (keyListener.keyPressed(KeyListener.KEY_SPACE)) {
      this.shopSkins = true;
    } else if (keyListener.keyPressed(KeyListener.KEY_P)) {
      this.shopPowerups = true;
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
    if(this.shopSkins) {
      return new SceneSkins(this.boardSize);
    } else if (this.shopPowerups) {
      return new ScenePowerups(this.boardSize);
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
