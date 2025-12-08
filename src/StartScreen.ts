import KeyListener from './KeyListener.js';
import CanvasRenderer from './CanvasRenderer.js';
import MouseListener from './MouseListener.js';


export default class StartScreen {
  private startButton: HTMLImageElement;

  private keyListener: KeyListener;

  private mouseListener: MouseListener;

  private posX: number;

  private posY: number;

  public constructor(canvas: HTMLCanvasElement) {
    this.mouseListener = new MouseListener(canvas, true);
    this.keyListener = new KeyListener;
    this.startButton = CanvasRenderer.loadNewImage('./assets/start.png');
    this.posX = (canvas.width - this.startButton.width) / 2;
    this.posY = (canvas.height - this.startButton.height) / 2;
  }

  public render(canvas: HTMLCanvasElement): void {
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) return;

    const scale: number = 0.5;
    ctx.drawImage(
      this.startButton,
      (canvas.width - this.startButton.width * scale) / 2,
      (canvas.height - this.startButton.height * scale) / 2,
      this.startButton.width * scale,
      this.startButton.height * scale
    );
  }


  public getPosX(): number {
    return this.posX;
  }

  public getPosY(): number {
    return this.posX;
  }
}
