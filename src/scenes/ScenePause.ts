import Scene from './Scene.js';
import SceneTrackSelection from './SceneTrackSelection.js';
import SceneStart from './SceneStart.js';
import SceneTutorial from './SceneTutorial.js';
import KeyListener from '../KeyListener.js';
import MouseListener, { MouseCoordinates } from '../MouseListener.js';
import Vector2 from '../Vector2.js';
import CanvasRenderer from '../CanvasRenderer.js';
import PlayerData from '../data/PlayerData.js';

export default class ScenePause extends Scene {
  private previousScene: Scene;

  private resume: boolean = false;

  private trackSelection: boolean = false;

  private quit: boolean = false;

  private logo: HTMLImageElement;

  private goToTutorial: boolean = false;

  private tutorialButton: HTMLImageElement;

  private tutorialScale: number = 1;

  public constructor(
    boardSize: Vector2,
    canvas: HTMLCanvasElement,
    previousScene: Scene
  ) {
    super(boardSize, canvas);
    this.previousScene = previousScene;
    this.logo = CanvasRenderer.loadNewImage('./assets/logo.png');
    this.tutorialButton = CanvasRenderer.loadNewImage('./assets/buttons/tutorial.png');
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
    this.isTutotialButtonPressed();
  }

  private isTutotialButtonPressed(): boolean {
    const mousePos: MouseCoordinates = this.mouseListener.getMousePosition();
    const margin: number = 30;

    const width: number = this.tutorialButton.width * this.tutorialScale;
    const height: number = this.tutorialButton.height * this.tutorialScale;

    const x: number = this.canvas.width - width - margin;
    const y: number = this.canvas.height - height - margin;

    const isClicked: boolean =
      mousePos.x >= x &&
      mousePos.x <= x + width &&
      mousePos.y >= y &&
      mousePos.y <= y + height;

    if (isClicked && this.mouseListener.buttonPressed(MouseListener.BUTTON_LEFT)) {
      this.goToTutorial = true;
      return true;
    }
    return false;
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
    } else if (this.goToTutorial) {
      this.goToTutorial = false;
      return new SceneTutorial(this.boardSize, this.canvas);
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
    // Render the scene under the pauseScene
    this.previousScene.render(canvas);

    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    // Render the overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Pausebox
    const boxWidth: number = 560;
    const boxHeight: number = 360;
    const boxX: number = canvas.width / 2 - boxWidth / 2;
    const boxY: number = canvas.height / 2 - boxHeight / 2;
    let contentY: number = boxY + 30;

    ctx.fillStyle = '#1e1e1e';
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

    ctx.strokeStyle = '#888';
    ctx.lineWidth = 3;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    // Render the logo
    if (this.logo.complete) {
      const logoWidth: number = 220;
      const logoRatio: number = this.logo.height / this.logo.width;
      const logoHeight: number = logoWidth * logoRatio;

      ctx.drawImage(
        this.logo,
        canvas.width / 2 - logoWidth / 2,
        contentY,
        logoWidth,
        logoHeight
      );

      contentY += logoHeight + 30;
    }

    // Renders the text
    CanvasRenderer.writeText(
      canvas,
      'Spel gepauzeerd',
      canvas.width / 2,
      contentY,
      'center',
      'Arial',
      20,
      '#cccccc'
    );

    // Render the options
    const startY: number = contentY + 50;
    const lineHeight: number = 36;
    const menuColor: string = '#e0e0e0';

    // Resume
    CanvasRenderer.writeText(
      canvas,
      '[ESC] Verder spelen',
      canvas.width / 2,
      startY,
      'center',
      'Arial',
      24,
      menuColor
    );

    // Trackselection
    CanvasRenderer.writeText(
      canvas,
      '[T] Trackselectie',
      canvas.width / 2,
      startY + lineHeight,
      'center',
      'Arial',
      24,
      menuColor
    );

    // Back to main menu
    CanvasRenderer.writeText(
      canvas,
      '[Q] Stoppen',
      canvas.width / 2,
      startY + lineHeight * 2,
      'center',
      'Arial',
      24,
      menuColor
    );

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
      PlayerData.getTurboTokens().toString(),
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
      PlayerData.getTurboCups().toString(),
      canvas.width - 80,
      padding + 5
    );

    // Render tutorialbutton
    const margin: number = 30;
    const width: number = this.tutorialButton.width * this.tutorialScale;
    const height: number = this.tutorialButton.height * this.tutorialScale;

    const tutX: number = canvas.width - width - margin;
    const tutY: number = canvas.height - height - margin;
    ctx.drawImage(
      this.tutorialButton,
      tutX,
      tutY,
      width,
      height
    );
  }
}
