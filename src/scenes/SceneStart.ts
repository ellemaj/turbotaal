import CanvasRenderer from '../CanvasRenderer.js';
import Vector2 from '../Vector2.js';
import MouseListener, { MouseCoordinates } from '../MouseListener.js';
import KeyListener from '../KeyListener.js';
import Scene from './Scene.js';
import SceneTrackSelection from './SceneTrackSelection.js';
import SceneShop from './SceneShop.js';
import SceneTutorial from './SceneTutorial.js';
import SceneGarage from './SceneGarage.js';

export default class SceneStart extends Scene {
  private goToTrackSelection: boolean;

  private goToShop: boolean;

  private goToTutorial: boolean;

  private goToGarage: boolean;

  private logo: HTMLImageElement;

  private startButton: HTMLImageElement;

  private shopButton: HTMLImageElement;

  private tutorialButton: HTMLImageElement;

  private logoLoaded: boolean = false;

  private startButtonLoaded: boolean = false;

  private shopButtonLoaded: boolean = false;

  private tutorialButtonLoaded: boolean = false;

  private startScale: number;

  private tutorialScale: number;

  public constructor(boardSize: Vector2, canvas: HTMLCanvasElement) {
    super(boardSize, canvas);
    this.goToTrackSelection = false;
    this.goToShop = false;
    this.goToTutorial = false;
    this.goToGarage = false;

    this.background = CanvasRenderer.loadNewImage('./assets/backgrounds/start.png');
    this.logo = CanvasRenderer.loadNewImage('./assets/logo.png');
    this.startButton = CanvasRenderer.loadNewImage('./assets/buttons/start.png');
    this.shopButton = CanvasRenderer.loadNewImage('./assets/buttons/shop.png');
    this.tutorialButton = CanvasRenderer.loadNewImage('./assets/buttons/tutorial.png');

    this.scale = 0.5;
    this.startScale = 1;
    this.tutorialScale = 1;

    this.logo.onload = (): void => {
      this.logoLoaded = true;
    };

    this.startButton.onload = (): void => {
      this.posX = (this.canvas.width - this.startButton.width * this.startScale) / 2;
      this.posY = (this.canvas.height - this.startButton.height * this.startScale) / 2;
      this.startButtonLoaded = true;
    };

    this.shopButton.onload = (): void => {
      this.shopButtonLoaded = true;
    };

    this.tutorialButton.onload = (): void => {
      this.tutorialButtonLoaded = true;
    };
  }

  // Looks if the startbutton is clicked
  private isStartButtonClicked(): boolean {
    if (!this.startButtonLoaded) {
      return false;
    }

    const mousePos: MouseCoordinates = this.mouseListener.getMousePosition();
    const buttonWidth: number = this.startButton.width * this.startScale;
    const buttonHeight: number = this.startButton.height * this.startScale;
    const buttonX: number = this.posX;
    const buttonY: number = this.posY;

    const isClicked: boolean =
      mousePos.x > buttonX &&
      mousePos.y > buttonY &&
      mousePos.x <= buttonX + buttonWidth &&
      mousePos.y <= buttonY + buttonHeight;

    // Change the scene to trackselection when the startbutton is pressed
    if (isClicked && this.mouseListener.buttonPressed(MouseListener.BUTTON_LEFT)) {
      this.goToTrackSelection = true;
      return true;
    }
    return false;
  }

  // Looks if the shopbutton is pressed
  private isShopButtonClicked(): boolean {
    if (!this.startButtonLoaded || !this.shopButtonLoaded) {
      return false;
    }
    const mousePos: MouseCoordinates = this.mouseListener.getMousePosition();
    const shopX: number = this.posX +
      (this.startButton.width * this.startScale - this.shopButton.width * this.scale) / 2;
    const shopY: number = this.posY - this.shopButton.height - 20;
    const isClicked: boolean =
      mousePos.x > shopX &&
      mousePos.y > shopY &&
      mousePos.x <= shopX + this.shopButton.width * this.scale &&
      mousePos.y <= shopY + this.shopButton.height * this.scale;
    if (isClicked && this.mouseListener.buttonPressed(MouseListener.BUTTON_LEFT)) {
      this.goToShop = true;
      return true;
    }
    return false;
  }

  // Looks if the tutorialbutton is pressed
  private isTutotialButtonPressed(): boolean {
    if (!this.tutorialButtonLoaded) {
      return false;
    }

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

  /**
   * Update function
   */
  public override update(delta: number): void {
    if (this.startButtonLoaded || this.shopButtonLoaded || this.tutorialButtonLoaded) {
      this.isStartButtonClicked();
      this.isShopButtonClicked();
      this.isTutotialButtonPressed();
    }
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
    if (keyListener.keyPressed(KeyListener.KEY_T)) {
      this.goToTutorial = true;
    } else if (keyListener.keyPressed(KeyListener.KEY_G)) {
      this.goToGarage = true;
    }
  }

  public override getNextScene(): Scene | null {
    if (this.goToTrackSelection) {
      return new SceneTrackSelection(this.boardSize, this.canvas);
    } else if (this.goToShop) {
      return new SceneShop(this.boardSize, this.canvas);
    } else if (this.goToTutorial) {
      return new SceneTutorial(this.boardSize, this.canvas);
    } else if (this.goToGarage) {
      return new SceneGarage(this.boardSize, this.canvas);
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

    // Render start button
    if (this.startButtonLoaded) {
      ctx.drawImage(
        this.startButton,
        this.posX,
        this.posY,
        this.startButton.width * this.startScale,
        this.startButton.height * this.startScale
      );
    }

    // Render shop button
    if (this.startButtonLoaded && this.shopButtonLoaded) {
      const shopX: number = this.posX +
        (this.startButton.width * this.startScale - this.shopButton.width * this.scale) / 2;
      const shopY: number = this.posY - this.shopButton.height * this.scale - 20;
      ctx.drawImage(
        this.shopButton, shopX, shopY,
        this.shopButton.width * this.scale,
        this.shopButton.height * this.scale
      );
    }

    // Render tutorial button
    if (this.tutorialButtonLoaded) {
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
    } else {
      ctx.fillStyle = 'black';
      ctx.font = 'bold 50px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Press T for the tutorial', this.canvas.width / 2, this.canvas.height / 2);
    }

    // Render the logo
    if (this.logoLoaded) {
      const logoX: number = this.posX +
        (this.startButton.width * this.startScale - this.logo.width * this.scale) / 2;
      const logoY: number = this.posY - this.logo.height * this.scale - 80;
      ctx.drawImage(
        this.logo, logoX, logoY,
        this.logo.width * this.scale,
        this.logo.height * this.scale
      );
    } else {
      ctx.fillStyle = 'black';
      ctx.font = 'bold 100px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('TurboTaal', this.canvas.width / 2, this.canvas.height / 4);
    }
  }
}
