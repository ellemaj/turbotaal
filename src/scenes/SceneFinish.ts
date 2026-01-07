import CanvasRenderer from '../CanvasRenderer.js';
import Vector2 from '../Vector2.js';
import MouseListener, { MouseCoordinates } from '../MouseListener.js';
import KeyListener from '../KeyListener.js';
import Scene from './Scene.js';
import PlayerData from '../data/PlayerData.js';
import SceneTrackSelection from './SceneTrackSelection.js';
import SceneStart from './SceneStart.js';

export default class SceneFinish extends Scene {
  private goToTrackselection: boolean;

  private goToStart: boolean;

  private raceAgain: boolean;

  public constructor(boardSize: Vector2, canvas: HTMLCanvasElement) {
    super(boardSize, canvas);
    this.goToTrackselection = false;
    this.goToStart = false;
    this.raceAgain = false;

    this.background = CanvasRenderer.loadNewImage('./assets/backgrounds/background.png');
  }

  /**
   * Update function
   */
  public override update(delta: number): void {
  }

  /**
   * Process input
   *
   * @param keyListener keylistener
   * @param mouseListener mouselistener
   */
  public override processInput(
    keyListener: KeyListener
  ): void {
  }

  public override getNextScene(): Scene | null {
    if (this.goToTrackselection) {
      return new SceneTrackSelection(this.boardSize, this.canvas);
    } else if (this.goToStart) {
      return new SceneStart(this.boardSize, this.canvas);
    } else if (this.raceAgain) {
      // return new Racetrack1(this.boardSize, this.canvas, this.grid);
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

    // Render the turboTokens
    let padding: number = 20;
    const tokenSize: number = 32;

    ctx.drawImage(
      this.turboToken,
      canvas.width - 120,
      padding,
      tokenSize,
      tokenSize
    );

    ctx.font = '24px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    ctx.fillText(
      PlayerData.getCoins().toString(),
      canvas.width - 80,
      padding + 5
    );

    // Render the turboCups
    padding = 60;
    const cupSize: number = 32;

    ctx.drawImage(
      this.turboCup,
      canvas.width - 120,
      padding,
      cupSize,
      cupSize
    );

    ctx.font = '24px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    ctx.fillText(
      PlayerData.getCups().toString(),
      canvas.width - 80,
      padding + 5
    );
  }
}
