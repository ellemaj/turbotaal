import KeyListener from './KeyListener.js';
import CanvasRenderer from './CanvasRenderer.js';
import MouseListener from './MouseListener.js';

export default class StartScreen {
  private startButton: HTMLImageElement;

  private keyListener: KeyListener;

  private mouseListener: MouseListener;

  private canvas: HTMLCanvasElement;

  public constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.mouseListener = new MouseListener(canvas, true);
    this.keyListener = new KeyListener;
    this.startButton = CanvasRenderer.loadNewImage('C:/Users/luukm/oop-team02/assets/start.png');
  }

  public draw(): void{
    CanvasRenderer.clearCanvas(this.canvas);
  if (this.startButton.complete){
    CanvasRenderer.drawImage(this.canvas, this.startButton, 200, 200);
  }
}
}
