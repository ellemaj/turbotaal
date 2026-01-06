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

  private logoLoaded: boolean = false;

  private logoScale: number;

  public constructor(boardSize: Vector2, canvas: HTMLCanvasElement) {
    super(boardSize, canvas);
    this.goBack = false;
    this.goToSkins = false;
    this.goToPowerups = false;

    this.coinImage = CanvasRenderer.loadNewImage('./assets/sprites/turbotoken.png');
    this.background = CanvasRenderer.loadNewImage('./assets/backgrounds/shop.png');
    this.logo = CanvasRenderer.loadNewImage('./assets/shoplogo.png');

    this.logoScale = 0.5;

    this.logo.onload = (): void => {
      this.logoLoaded = true;
    };
  }

  /**
   * Update function
   */
  public override update(delta: number): void {
    //
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
    }

    if (keyListener.keyPressed(KeyListener.KEY_S)) {
      this.goToSkins = true;
    }

    if (keyListener.keyPressed(KeyListener.KEY_P)) {
      this.goToPowerups = true;
    }
  }

  public override getNextScene(): Scene | null {
    if (this.goBack) {
      return new SceneStart(this.boardSize, this.canvas);
    } else if (this.goToSkins) {
      return new SceneGarage(this.boardSize, this.canvas);
    } else if (this.goToPowerups) {
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
