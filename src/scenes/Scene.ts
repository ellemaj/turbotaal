import KeyListener from '../KeyListener.js';
import MouseListener from '../MouseListener.js';
import CanvasRenderer from '../CanvasRenderer.js';
import Vector2 from '../Vector2.js';

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default abstract class Scene{
  protected boardSize: Vector2;

  protected background: HTMLImageElement;

  protected walter: HTMLImageElement;

  protected cheeta: HTMLImageElement;

  protected scale: number;

  protected posX: number;

  protected posY: number;

  protected mouseListener: MouseListener;

  protected canvas: HTMLCanvasElement;

  protected turboToken: HTMLImageElement;

  protected turboCup: HTMLImageElement;

  protected logo: HTMLImageElement;

  protected logo67: HTMLImageElement;

  protected backButton: HTMLImageElement;

  protected tutorialButton: HTMLImageElement;

  protected backScale: number;

  protected showBackButton: boolean = false;

  protected isBackHover: boolean = false;

  protected backClicked: boolean = false;

  public constructor(boardSize: Vector2, canvas: HTMLCanvasElement) {
    this.boardSize = boardSize;
    this.background = new Image();
    this.walter = CanvasRenderer.loadNewImage('./assets/sprites/wasbeer1.png');
    this.cheeta = CanvasRenderer.loadNewImage('./assets/sprites/cheetah1.png');
    this.scale = 1;
    this.posX = 0;
    this.posY = 0;
    this.mouseListener = new MouseListener(canvas, true);
    this.canvas = canvas;
    this.turboToken = CanvasRenderer.loadNewImage('./assets/sprites/turbotoken.png');
    this.turboCup = CanvasRenderer.loadNewImage('./assets/sprites/turbocup.png');
    this.logo = CanvasRenderer.loadNewImage('./assets/logo.png');
    this.logo67 = CanvasRenderer.loadNewImage('./assets/logo67.png');
    this.backButton = CanvasRenderer.loadNewImage('./assets/buttons/back.png');
    this.tutorialButton = CanvasRenderer.loadNewImage('./assets/buttons/tutorial.png');
    this.backScale = 1;
  }

  public abstract processInput(
    keyListener: KeyListener,
    mouseListener: MouseListener): void;

  public abstract update(delta: number): void;

  public abstract getNextScene(): Scene | null;

  public abstract render(canvas: HTMLCanvasElement): void;

  /**
   ****** Back button ******
   * Use and render the goBack button in any scene
   ***
   * In the constructor of the scene: this.showBackButton = true; (For scaling; this.backScale = ..)
   ***
   * In processInput: this.updateBackButton(
   * mouseListener.getMousePosition(),
   * mouseListener.buttonPressed(MouseListener.BUTTON_LEFT)
   * );
   ***
   * In render: this.renderBackButton(ctx);
   ***
   * In update:
   * if (this.backClicked) { this.goBack = true; this.backClicked = false; }
   ***
   * @returns Rect
   */
  protected getBackButtonRect(): Rect {
    const padding: number = 20;
    const width: number = this.backButton.width * this.backScale;
    const height: number = this.backButton.height * this.backScale;

    return {
      x: padding,
      y: this.canvas.height - height - padding,
      width,
      height,
    };
  }

  protected updateBackButton(mouse: { x: number; y: number }, mousePressed: boolean): void {
    if (!this.showBackButton) {
      return;
    }

    const rect: Rect = this.getBackButtonRect();

    this.isBackHover =
    mouse.x >= rect.x &&
    mouse.x <= rect.x + rect.width &&
    mouse.y >= rect.y &&
    mouse.y <= rect.y + rect.height;

    if (mousePressed && this.isBackHover) {
      this.backClicked = true;
    }
  }

  protected renderBackButton(ctx: CanvasRenderingContext2D): void {
    if (!this.showBackButton) {
      return;
    }

    const rect: Rect = this.getBackButtonRect();
    const scale: number = this.isBackHover ? 1.1 : 1;

    const w: number = rect.width * scale;
    const h: number = rect.height * scale;

    ctx.drawImage(
      this.backButton,
      rect.x - (w - rect.width) / 2,
      rect.y - (h - rect.height) / 2,
      w,
      h
    );
  }
};
