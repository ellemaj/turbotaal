import CanvasRenderer from '../CanvasRenderer.js';
import Vector2 from '../Vector2.js';
import MouseListener, { MouseCoordinates } from '../MouseListener.js';
import KeyListener from '../KeyListener.js';
import Scene from './Scene.js';
import SceneTrackSelection from './SceneTrackSelection.js';
import SceneShop from './SceneShop.js';
import SceneTutorial from './SceneTutorial.js';
import SceneGarage from './SceneGarage.js';
import SceneAdmin from './SceneAdmin.js';

export default class SceneStart extends Scene {
  private goToTrackSelection: boolean;

  private goToShop: boolean;

  private goToTutorial: boolean;

  private goToGarage: boolean;

  private goToAdmin: boolean;

  private startButton: HTMLImageElement;

  private shopButton: HTMLImageElement;

  private garageButton: HTMLImageElement;

  private logoLoaded: boolean = false;

  private startButtonLoaded: boolean = false;

  private shopButtonLoaded: boolean = false;

  private garageButtonLoaded: boolean = false;

  private tutorialButtonLoaded: boolean = false;

  private logoScale: number;

  private startScale: number;

  private tutorialScale: number;

  private shopX: number = 0;

  private shopY: number = 0;

  private garageX: number = 0;

  private garageY: number = 0;

  public constructor(boardSize: Vector2, canvas: HTMLCanvasElement) {
    super(boardSize, canvas);
    this.goToTrackSelection = false;
    this.goToShop = false;
    this.goToTutorial = false;
    this.goToGarage = false;
    this.goToAdmin = false;

    this.background = CanvasRenderer.loadNewImage('./assets/backgrounds/start.png');
    this.startButton = CanvasRenderer.loadNewImage('./assets/buttons/start.png');
    this.shopButton = CanvasRenderer.loadNewImage('./assets/buttons/shop.png');
    this.garageButton = CanvasRenderer.loadNewImage('./assets/buttons/garage.png');

    this.logoScale = 0.5;
    this.scale = 0.6;
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

    this.garageButton.onload = (): void => {
      this.garageButtonLoaded = true;
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
    if (!this.shopButtonLoaded) {
      return false;
    }

    const mousePos: MouseCoordinates = this.mouseListener.getMousePosition();
    const width: number = this.shopButton.width * this.scale;
    const height: number = this.shopButton.height* this.scale;

    const isClicked: boolean =
      mousePos.x >= this.shopX &&
      mousePos.x <= this.shopX + width &&
      mousePos.y >= this.shopY &&
      mousePos.y <= this.shopY + height;

    if (isClicked && this.mouseListener.buttonPressed(MouseListener.BUTTON_LEFT)) {
      this.goToShop = true;
      return true;
    }
    return false;
  }

  // Looks if the garagebutton is pressed
  private isGarageButtonClicked(): boolean {
    if (!this.garageButtonLoaded) {
      return false;
    }

    const mousePos: MouseCoordinates = this.mouseListener.getMousePosition();
    const width: number = this.garageButton.width * this.scale;
    const height: number = this.garageButton.height* this.scale;

    const isClicked: boolean =
      mousePos.x >= this.garageX &&
      mousePos.x <= this.garageX + width &&
      mousePos.y >= this.garageY &&
      mousePos.y <= this.garageY + height;

    if (isClicked && this.mouseListener.buttonPressed(MouseListener.BUTTON_LEFT)) {
      this.goToGarage = true;
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
  public override update(): void {
    if (this.startButtonLoaded || this.shopButtonLoaded || this.tutorialButtonLoaded) {
      this.isStartButtonClicked();
      this.isShopButtonClicked();
      this.isGarageButtonClicked();
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
    keyListener: KeyListener
  ): void {
    if (keyListener.keyPressed(KeyListener.KEY_ENTER)) {
      this.goToTrackSelection = true;
    } else if (keyListener.keyPressed(KeyListener.KEY_S)) {
      this.goToShop = true;
    } else if (keyListener.keyPressed(KeyListener.KEY_G)) {
      this.goToGarage = true;
    } else if (keyListener.keyPressed(KeyListener.KEY_T)) {
      this.goToTutorial = true;
    } else if (keyListener.keyPressed(KeyListener.KEY_A)) {
      this.goToAdmin = true;
    }
  }

  public override getNextScene(): Scene | null {
    if (this.goToTrackSelection) {
      this.goToTrackSelection = false;
      return new SceneTrackSelection(this.boardSize, this.canvas);
    } else if (this.goToShop) {
      this.goToShop = false;
      return new SceneShop(this.boardSize, this.canvas);
    } else if (this.goToTutorial) {
      this.goToTutorial = false;
      return new SceneTutorial(this.boardSize, this.canvas);
    } else if (this.goToGarage) {
      this.goToGarage = false;
      return new SceneGarage(this.boardSize, this.canvas, this);
    } else if (this.goToAdmin) {
      this.goToAdmin = false;
      return new SceneAdmin(this.boardSize, this.canvas);
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

    const centerX: number = canvas.width / 2;
    let currentY: number = canvas.height * 0.10;
    const spacing: number = 10; // Room between the buttons

    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';

    // Render the logo
    if (this.logoLoaded) {
      const logoWidth: number = this.logo.width * this.logoScale;
      const logoHeight: number = this.logo.height * this.logoScale;

      ctx.drawImage(
        this.logo,
        centerX - logoWidth / 2,
        currentY,
        logoWidth, logoHeight
      );

      currentY += logoHeight + spacing;
    } else {
      ctx.font = 'bold 100px Arial';
      ctx.fillText('TurboTaal', centerX, currentY + 80);
      currentY += 100 + spacing;
    }

    // Render start button
    if (this.startButtonLoaded) {
      const width: number = this.startButton.width * this.startScale;
      const height: number = this.startButton.height * this.startScale;

      this.posX = centerX - width / 2;
      this.posY = currentY;

      ctx.drawImage(
        this.startButton,
        this.posX,
        this.posY,
        width,
        height
      );

      currentY += height + spacing;
    } else {
      ctx.font = 'bold 25px Arial';
      ctx.fillText('Press ENTER to start', centerX, currentY + 25);
      currentY += 40 + spacing;
    }

    // Render shop button
    if (this.shopButtonLoaded) {
      const width: number = this.shopButton.width * this.scale;
      const height: number = this.shopButton.height * this.scale;

      this.shopX = centerX - width / 2;
      this.shopY = currentY;

      ctx.drawImage(
        this.shopButton,
        this.shopX,
        this.shopY,
        width,
        height
      );

      currentY += height + spacing;
    } else {
      ctx.fillText('Press S for the shop', centerX, currentY + 25);
      currentY += 40 + spacing;
    }

    // Render garage button
    if (this.garageButtonLoaded) {
      const width: number = this.garageButton.width * this.scale;
      const height: number = this.garageButton.height * this.scale;

      this.garageX = centerX - width / 2;
      this.garageY = currentY;

      ctx.drawImage(
        this.garageButton,
        this.garageX,
        this.garageY,
        width,
        height
      );
    } else {
      ctx.fillText('Press G for the garage', centerX, currentY + 25);
      currentY += 40 + spacing;
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
      ctx.fillText('Press T for the tutorial', centerX, currentY + 25);
      currentY += 40 + spacing;
    }
  }
}
