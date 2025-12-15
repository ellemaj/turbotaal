import Scene from './Scene.js';
import SceneTrackSelection from './SceneTrackSelection.js';
import SceneStart from './SceneStart.js';
import KeyListener from '../KeyListener.js';
import MouseListener from '../MouseListener.js';
import Vector2 from '../Vector2.js';
import CanvasRenderer from '../CanvasRenderer.js';

export default class ScenePause extends Scene {
  private previousScene: Scene;

  private resume: boolean = false;

  private trackSelection: boolean = false;

  private quit: boolean = false;

  public constructor(
    boardSize: Vector2,
    canvas: HTMLCanvasElement,
    previousScene: Scene
  ) {
    super(boardSize, canvas);
    this.previousScene = previousScene;
  }

  /**
   * Processes the input
   *
   * @param keyListener keylistener that is used
   * @param mouseListener mouselistener that is used
   */
  public override processInput(keyListener: KeyListener, mouseListener: MouseListener): void {
    if (keyListener.keyPressed(KeyListener.KEY_ESC)) {
      this.resume = true;
    }

    if (keyListener.keyPressed(KeyListener.KEY_T)) {
      this.trackSelection = true;
    }

    if (keyListener.keyPressed(KeyListener.KEY_Q)) {
      this.quit = true;
    }
  }

  /**
   * Update function, nothing needs to update when ScenePause is loaded.
   *
   * @param delta time elapsed
   */
  public override update(delta: number): void {
    //
  }

  // Gives back the right scene
  public override getNextScene(): Scene | null {
    if (this.resume) {
      return this.previousScene;
    }

    if (this.trackSelection) {
      return new SceneTrackSelection(this.boardSize, this.canvas);
    }

    if (this.quit) {
      return new SceneStart(this.boardSize, this.canvas);
    }

    return null;
  }

  /**
   * Renders the pausemenu
   *
   * @param canvas canvas it needs to be rendered on
   * @returns nothing
   */
  public render(canvas: HTMLCanvasElement): void {
    // Render the scene under the pausescene
    this.previousScene.render(canvas);

    // Overlay
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render the text
    CanvasRenderer.writeText(
      canvas,
      'PAUZE',
      canvas.width / 2,
      canvas.height / 2 - 40,
      'center',
      'Arial',
      48,
      'white'
    );

    CanvasRenderer.writeText(
      canvas,
      'ESC = verder | T = trackselection | Q = stoppen',
      canvas.width / 2,
      canvas.height / 2 + 20,
      'center',
      'Arial',
      22,
      'white'
    );
  }
}
