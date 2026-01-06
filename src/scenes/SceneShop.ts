import CanvasRenderer from '../CanvasRenderer.js';
import Vector2 from '../Vector2.js';
import MouseListener, { MouseCoordinates } from '../MouseListener.js';
import KeyListener from '../KeyListener.js';
import Scene from './Scene.js';
import PlayerData from '../data/PlayerData.js';
import SceneStart from './SceneStart.js';
import SceneGarage from './SceneGarage.js';
import ScenePowerups from './ScenePowerups.js';

export default class SceneShop extends Scene {
  private goBack: boolean;

  private goToSkins: boolean;

  private goToPowerups: boolean;

  private coinImage: HTMLImageElement;

  private logo: HTMLImageElement;

  private skinsButton: HTMLImageElement;

  private powerupButton: HTMLImageElement;

  private logoLoaded: boolean = false;

  private skinsButtonLoaded: boolean = false;

  private powerupButtonLoaded: boolean = false;

  private logoScale: number;

  private skinsButtonX: number = 0;

  private skinsButtonY: number = 0;

  private powerupButtonX: number = 0;

  private powerupButtonY: number = 0;

  public constructor(boardSize: Vector2, canvas: HTMLCanvasElement) {
    super(boardSize, canvas);
    this.goBack = false;
    this.goToSkins = false;
    this.goToPowerups = false;

    this.coinImage = CanvasRenderer.loadNewImage('./assets/sprites/turbotoken.png');
    this.background = CanvasRenderer.loadNewImage('./assets/backgrounds/shop.png');
    this.logo = CanvasRenderer.loadNewImage('./assets/shoplogo.png');
    this.skinsButton = CanvasRenderer.loadNewImage('./assets/buttons/skins.png');
    this.powerupButton = CanvasRenderer.loadNewImage('./assets/buttons/powerup.png');

    this.logoScale = 0.5;
    this.scale = 1.25;

    this.logo.onload = (): void => {
      this.logoLoaded = true;
    };

    this.skinsButton.onload = (): void => {
      this.skinsButtonLoaded = true;
    };

    this.powerupButton.onload = (): void => {
      this.powerupButtonLoaded = true;
    };
  }

  // Looks if the skinsbutton is clicked
  private isSkinsButtonClicked(): boolean {
    if (!this.skinsButtonLoaded) {
      return false;
    }

    const mousePos: MouseCoordinates = this.mouseListener.getMousePosition();
    const width: number = this.skinsButton.width * this.scale;
    const height: number = this.skinsButton.height * this.scale;

    const isClicked: boolean =
    mousePos.x >= this.skinsButtonX &&
    mousePos.x <= this.skinsButtonX + width &&
    mousePos.y >= this.skinsButtonY &&
    mousePos.y <= this.skinsButtonY + height;

    if (isClicked && this.mouseListener.buttonPressed(MouseListener.BUTTON_LEFT)) {
      this.goToSkins = true;
      return true;
    }
    return false;
  }

  // Looks if the powerup button is clicked
  private isPowerupButtonClicked(): boolean {
    if (!this.powerupButtonLoaded) {
      return false;
    }

    const mousePos: MouseCoordinates = this.mouseListener.getMousePosition();
    const width: number = this.powerupButton.width * this.scale;
    const height: number = this.powerupButton.height * this.scale;

    const isClicked: boolean =
    mousePos.x >= this.powerupButtonX &&
    mousePos.x <= this.powerupButtonX + width &&
    mousePos.y >= this.powerupButtonY &&
    mousePos.y <= this.powerupButtonY + height;

    if (isClicked && this.mouseListener.buttonPressed(MouseListener.BUTTON_LEFT)) {
      this.goToPowerups = true;
      return true;
    }
    return false;
  }

  /**
   * Update function
   */
  public override update(delta: number): void {
    if (this.skinsButtonLoaded || this.powerupButtonLoaded) {
      this.isSkinsButtonClicked();
      this.isPowerupButtonClicked();
    }
  }

  /**
   * Process input
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
    } else if (keyListener.keyPressed(KeyListener.KEY_S)) {
      this.goToSkins = true;
    } else if (keyListener.keyPressed(KeyListener.KEY_P)) {
      this.goToPowerups = true;
    }
  }

  public override getNextScene(): Scene | null {
    if (this.goBack) {
      this.goBack = false;
      return new SceneStart(this.boardSize, this.canvas);
    } else if (this.goToSkins) {
      this.goToSkins = false;
      return new SceneGarage(this.boardSize, this.canvas, this);
    } else if (this.goToPowerups) {
      this.goToPowerups = false;
      return new ScenePowerups(this.boardSize, this.canvas);
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
    let currentY: number = canvas.height * 0.06;
    const spacing: number = 100; // Room between the buttons

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

    const buttonY: number = currentY + 30;
    const gap: number = 75; // room between the buttons

    // Render skins button
    if (this.skinsButtonLoaded) {
      const width: number = this.skinsButton.width * this.scale;
      const height: number = this.skinsButton.height * this.scale;

      this.skinsButtonX = centerX - gap / 2 - width;
      this.skinsButtonY = buttonY;

      ctx.drawImage(
        this.skinsButton,
        this.skinsButtonX,
        this.skinsButtonY,
        width,
        height
      );

      currentY += height + spacing;
    } else {
      ctx.font = 'bold 25px Arial';
      ctx.fillText('Press S to go to skins', centerX, currentY + 25);
      currentY += 40 + spacing;
    }

    // Render powerup button
    if (this.powerupButtonLoaded) {
      const width: number = this.powerupButton.width * this.scale;
      const height: number = this.powerupButton.height * this.scale;

      this.powerupButtonX = centerX + gap / 2;
      this.powerupButtonY = buttonY;

      ctx.drawImage(
        this.powerupButton,
        this.powerupButtonX,
        this.powerupButtonY,
        width,
        height
      );

      currentY += height + spacing;
    } else {
      ctx.font = 'bold 25px Arial';
      ctx.fillText('Press P to go to powerup', centerX, currentY + 25);
      currentY += 40 + spacing;
    }


    // Render the coins
    const padding: number = 20;
    const coinSize: number = 32;

    ctx.drawImage(
      this.coinImage,
      canvas.width - 160,
      padding,
      coinSize,
      coinSize
    );

    ctx.font = '24px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    ctx.fillText(
      PlayerData.getCoins().toString(),
      canvas.width - 115,
      padding + 4
    );
  }
}
