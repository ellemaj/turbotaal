import CanvasRenderer from '../CanvasRenderer.js';
import KeyListener from '../KeyListener.js';
import Vector2 from '../Vector2.js';
import SceneShop from './SceneShop.js';
import Scene from './Scene.js';

export default class ScenePowerups extends Scene {
  private shopPowerups: boolean;

  public constructor(boardSize: Vector2, canvas: HTMLCanvasElement) {
    super(boardSize, canvas);
    this.shopPowerups = true;
  }

  /**
   * Starts the game when space is pressed
   *
   * @param keyListener Looks is the space key is being pressed
   */
  public override processInput(keyListener: KeyListener): void {
    if (keyListener.keyPressed(KeyListener.KEY_SPACE)) {
      this.shopPowerups = false;
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
    if(!this.shopPowerups){
      return new SceneShop(this.boardSize, this.canvas);
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
      'Powerups. Press space to go back to the shop menu',
      this.boardSize.x / 2,
      this.boardSize.y / 2);
  }
}
