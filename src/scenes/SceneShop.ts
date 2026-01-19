import CanvasRenderer from '../CanvasRenderer.js';
import Vector2 from '../Vector2.js';
import MouseListener, { MouseCoordinates } from '../MouseListener.js';
import KeyListener from '../KeyListener.js';
import Scene from './Scene.js';
import PlayerData from '../data/PlayerData.js';
import SceneStart from './SceneStart.js';
import SceneGarage from './SceneGarage.js';

export default class SceneShop extends Scene {
  private goBack: boolean;

  private goToSkins: boolean;

  private skinsButton: HTMLImageElement;

  private logoLoaded: boolean = false;

  private skinsButtonLoaded: boolean = false;

  private logoScale: number;

  private skinsButtonX: number = 0;

  private skinsButtonY: number = 0;

  public constructor(boardSize: Vector2, canvas: HTMLCanvasElement) {
    super(boardSize, canvas);
    this.goBack = false;
    this.goToSkins = false;

    this.background = CanvasRenderer.loadNewImage('./assets/backgrounds/shop.png');
    this.logo = CanvasRenderer.loadNewImage('./assets/shoplogo.png');
    this.skinsButton = CanvasRenderer.loadNewImage('./assets/buttons/skins.png');

    this.showBackButton = true;

    this.logoScale = 0.5;
    this.scale = 1.25;

    this.logo.onload = (): void => {
      this.logoLoaded = true;
    };

    this.skinsButton.onload = (): void => {
      this.skinsButtonLoaded = true;
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

  /**
   * Update function
   */
  public override update(): void {
    if (this.skinsButtonLoaded) {
      this.isSkinsButtonClicked();
    }

    if (this.backClicked) {
      this.goBack = true;
      this.backClicked = false;
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
    }

    this.updateBackButton(
      mouseListener.getMousePosition(),
      mouseListener.buttonPressed(MouseListener.BUTTON_LEFT)
    );
  }

  public override getNextScene(): Scene | null {
    if (this.goBack) {
      this.goBack = false;
      return new SceneStart(this.boardSize, this.canvas);
    } else if (this.goToSkins) {
      this.goToSkins = false;
      return new SceneGarage(this.boardSize, this.canvas, this);
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

    // Render skins button
    if (this.skinsButtonLoaded) {
      const width: number = this.skinsButton.width * this.scale;
      const height: number = this.skinsButton.height * this.scale;

      this.skinsButtonX = (canvas.width - width) / 2;
      this.skinsButtonY = currentY;

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
      ctx.fillText('Press S to go to skins', canvas.width / 2, currentY + 25);
      currentY += 40 + spacing;
    }

    // Render the turboTokens
    const padding: number = 20;
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

    // Render the back button
    this.renderBackButton(ctx);
  }
}
