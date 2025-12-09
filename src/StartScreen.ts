import KeyListener from './KeyListener.js';
import CanvasRenderer from './CanvasRenderer.js';
import MouseListener, { MouseCoordinates } from './MouseListener.js';


export default class StartScreen {
  private startButton: HTMLImageElement;

  private keyListener: KeyListener;

  private mouseListener: MouseListener;

  private posX: number;

  private posY: number;

  private scale: number = 0.5;

  private canvas: HTMLCanvasElement;

  public constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.mouseListener = new MouseListener(canvas, true);
    this.keyListener = new KeyListener;
    this.startButton = CanvasRenderer.loadNewImage('./assets/start.png');
    this.posX = (canvas.width - this.startButton.width) / 2;
    this.posY = (canvas.height - this.startButton.height) / 2;
  }

  /**
   *center the picture
   */
  public render(canvas: HTMLCanvasElement): void {
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.drawImage(
      this.startButton,
      (canvas.width - this.startButton.width * this.scale) / 2,
      (canvas.height - this.startButton.height * this.scale) / 2,
      this.startButton.width * this.scale,
      this.startButton.height * this.scale
    );
  }

  private isStartButtonClicked(): boolean {
    const mousePos: MouseCoordinates = this.mouseListener.getMousePosition();
    const buttonWidth: number = this.startButton.width * this.scale;
    const buttonHeight: number = this.startButton.height * this.scale;
    const buttonX: number = (this.canvas.width - buttonWidth) / 2;
    const buttonY: number = (this.canvas.height - buttonHeight) / 2;
    const isButtonClicked: boolean =
      mousePos.x > buttonX &&
      mousePos.y > buttonY &&
      mousePos.x <= buttonX + buttonWidth &&
      mousePos.y <= buttonY + buttonHeight;

    if (isButtonClicked && this.mouseListener.buttonPressed(MouseListener.BUTTON_LEFT)) {
      console.log('lesgoooooooo');
      return true;
    }
    return false;
  }

  /**
   *updatej
   */
  public update(): void {
    this.isStartButtonClicked();
  }

  public getPosX(): number {
    return this.posX;
  }

  public getPosY(): number {
    return this.posY;
  }
}
