import CanvasRenderer from '../CanvasRenderer.js';
import Vector2 from '../Vector2.js';
import MouseListener, { MouseCoordinates } from '../MouseListener.js';
import KeyListener from '../KeyListener.js';
import Scene from './Scene.js';
import PlayerData from '../data/PlayerData.js';
import SceneStart from './SceneStart.js';
import SceneShop from './SceneShop.js';

export default class ScenePowerups extends Scene {
  private goBack: boolean;

  public constructor(boardSize: Vector2, canvas: HTMLCanvasElement) {
    super(boardSize, canvas);
    this.goBack = false;

    this.background = CanvasRenderer.loadNewImage('./assets/backgrounds/background.png');
  }

  /**
   * Update function
   */
  public override update(delta: number): void {
    //
  }

  /**
   * processinput
   *
   * @param keyListener keylistener
   * @param mouseListener mouselistener
   */
  public override processInput(
    keyListener: KeyListener,
    mouseListener: MouseListener
  ): void {
    if (keyListener.keyPressed(KeyListener.KEY_ESC)) {
      this.goBack = true;
    }
  }

  public override getNextScene(): Scene | null {
    if (this.goBack) {
      return new SceneStart(this.boardSize, this.canvas);
    }
    return null;
  }

  /**
   * Render
   */
  public override render(canvas: HTMLCanvasElement): void {
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.drawImage(this.background, 0, 0, canvas.width, canvas.height);
  }
}
