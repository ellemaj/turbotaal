import Scene from './Scene.js';
import KeyListener from '../KeyListener.js';
import MouseListener from '../MouseListener.js';
import Vector2 from '../Vector2.js';
import CanvasRenderer from '../CanvasRenderer.js';
import ScenePause from './ScenePause.js';

export default class ScenePitstop extends Scene {
  private previousScene: Scene;

  private pause: boolean;

  private resumeRace: boolean;

  // private nextDialog: boolean;

  public constructor(
    boardSize: Vector2,
    canvas: HTMLCanvasElement,
    previousScene: Scene
  ) {
    super(boardSize, canvas);
    this.pause = false;
    this.resumeRace = false;
    this.previousScene = previousScene;
    this.background = CanvasRenderer.loadNewImage('./assets/pitstop1.png');
  }

  /**
   * Processes the input
   *
   * @param keyListener keylistener that is being used
   * @param mouseListener mouselistener that is being used
   */
  public override processInput(keyListener: KeyListener, mouseListener: MouseListener): void {
    if (keyListener.keyPressed(KeyListener.KEY_ESC)) {
      this.pause = true;
    }

    // if (keyListener.keyPressed(KeyListener.KEY_SPACE)) {
    //   this.nextDialog = true;
    // }

    if (keyListener.keyPressed(KeyListener.KEY_R)) { // Only for debugging!!
      this.resumeRace = true;
    }
  }

  /**
   * Updates the game
   *
   * @param delta time elapsed
   */
  public override update(delta: number): void {
    //
  }

  public override getNextScene(): Scene | null {
    if (this.resumeRace) {
      this.resumeRace = false;
      return this.previousScene;
    }

    if (this.pause) {
      this.pause = false;
      return new ScenePause(this.boardSize, this.canvas, this);
    }

    return null;
  }

  /**
   * Renders all the things in scenepitstop
   *
   * @param canvas the canvas it needs to be rendered on
   * @returns yes
   */
  public render(canvas: HTMLCanvasElement): void {
    // Render the racingscene under the pitstop
    this.previousScene.render(canvas);

    // Overlay
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.drawImage(this.background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(this.walter, 10, 0);

    // Render the text
    CanvasRenderer.writeText(
      canvas,
      'Pitstop',
      canvas.width / 2,
      canvas.height / 2 - 80,
      'center',
      'Arial',
      48,
      'black'
    );
  }
}
