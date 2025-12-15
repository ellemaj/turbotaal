import CanvasRenderer from '../CanvasRenderer.js';
import Vector2 from '../Vector2.js';
import MouseListener, { MouseCoordinates } from '../MouseListener.js';
import KeyListener from '../KeyListener.js';
import Scene from './Scene.js';
import SceneTrackSelection from './SceneTrackSelection.js';
import SceneShop from './SceneShop.js';

export default class SceneStart extends Scene {
  private goToTrackSelection: boolean;

  private goToShop: boolean;

  private goBack: boolean;

  private startButton: HTMLImageElement;

  private startButtonLoaded: boolean = false;

  private shopButtonLoaded: boolean = false;

  private shopButton: HTMLImageElement;

  public constructor(boardSize: Vector2, canvas: HTMLCanvasElement) {
    super(boardSize, canvas);
    this.goToTrackSelection = false;
    this.goToShop = false;
    this.goBack = false;

    this.startButton = CanvasRenderer.loadNewImage('./assets/start.png');
    this.background = CanvasRenderer.loadNewImage('./assets/background.png');
    this.shopButton = CanvasRenderer.loadNewImage('./assets/shop.png');
    this.scale = 0.5;

    this.startButton.onload = (): void => {
      this.posX = (this.canvas.width - this.startButton.width * this.scale) / 2;
      this.posY = (this.canvas.height - this.startButton.height * this.scale) / 2;
      this.startButtonLoaded = true;
    };
    this.shopButton.onload = (): void => {
      this.shopButtonLoaded = true;
    };
  }

  private isStartButtonClicked(): boolean {
    if (!this.startButtonLoaded) {
      return false;
    }

    const mousePos: MouseCoordinates = this.mouseListener.getMousePosition();
    const buttonWidth: number = this.startButton.width * this.scale;
    const buttonHeight: number = this.startButton.height * this.scale;
    const buttonX: number = this.posX;
    const buttonY: number = this.posY;

    const isClicked: boolean =
      mousePos.x > buttonX &&
      mousePos.y > buttonY &&
      mousePos.x <= buttonX + buttonWidth &&
      mousePos.y <= buttonY + buttonHeight;

    if (isClicked && this.mouseListener.buttonPressed(MouseListener.BUTTON_LEFT)) {
      this.goToTrackSelection = true;
      return true;
    }
    return false;
  }

  private isShopButtonClicked(): boolean {
    if (!this.startButtonLoaded || !this.shopButtonLoaded) {
      return false;
    }
    const mousePos: MouseCoordinates = this.mouseListener.getMousePosition();
    const shopX: number = this.posX +
      (this.startButton.width * this.scale - this.shopButton.width * this.scale) / 2;
    const shopY: number = this.posY - this.shopButton.height - 20;
    const isClicked: boolean =
      mousePos.x > shopX &&
      mousePos.y > shopY &&
      mousePos.x <= shopX + this.shopButton.width &&
      mousePos.y <= shopY + this.shopButton.height;
    if (isClicked && this.mouseListener.buttonPressed(MouseListener.BUTTON_LEFT)) {
      this.goToShop = true;
      return true;
    }
    return false;

  }

  /**
   * Update function
   */
  public override update(delta: number): void {
    if (this.startButtonLoaded || this.shopButtonLoaded) {
      this.isStartButtonClicked();
      this.isShopButtonClicked();
    }

    // this.isShopButtonClicked();
  }

  /**
   * processinput (not in use)
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
    if (this.goToTrackSelection) {
      return new SceneTrackSelection(this.boardSize, this.canvas);
    } else if (this.goToShop) {
      return new SceneShop(this.boardSize, this.canvas);
    }
    return null;
  }

  /**
   *center the picture
   */
  public override render(canvas: HTMLCanvasElement): void {
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.drawImage(this.background, 0, 0, canvas.width, canvas.height);

    if (this.startButtonLoaded) {
      ctx.drawImage(
        this.startButton,
        this.posX,
        this.posY,
        this.startButton.width * this.scale,
        this.startButton.height * this.scale
      );
    }
    // render shop button
    if (this.startButtonLoaded && this.shopButtonLoaded) {
      const shopX: number = this.posX +
        (this.startButton.width * this.scale - this.shopButton.width * this.scale) / 2;
      const shopY: number = this.posY - this.shopButton.height * this.scale - 20;
      ctx.drawImage(
        this.shopButton, shopX, shopY,
        this.shopButton.width * this.scale,
        this.shopButton.height * this.scale
      );
    }
    // Renders the title on the screen
    ctx.fillStyle = 'black';
    ctx.font = 'bold 100px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('TurboTaal', this.canvas.width / 2, this.canvas.height / 4);
  }
}
