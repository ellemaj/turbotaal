import KeyListener from '../KeyListener.js';
import MouseListener from '../MouseListener.js';
import CanvasRenderer from '../CanvasRenderer.js';
import Vector2 from '../Vector2.js';

export default abstract class Scene{
  protected boardSize: Vector2;

  protected background: HTMLImageElement;

  protected walter: HTMLImageElement;

  protected scale: number;

  protected posX: number;

  protected posY: number;

  protected mouseListener: MouseListener;

  protected canvas: HTMLCanvasElement;

  public constructor(boardSize: Vector2, canvas: HTMLCanvasElement) {
    this.boardSize = boardSize;
    this.background = new Image();
    this.walter = CanvasRenderer.loadNewImage('./assets/wasbeer1.png');
    this.scale = 1;
    this.posX = 0;
    this.posY = 0;
    this.mouseListener = new MouseListener(canvas, true);
    this.canvas = canvas;
  }

  public abstract processInput(
    keyListener: KeyListener,
    mouseListener: MouseListener): void;

  public abstract update(delta: number): void;

  public abstract getNextScene(): Scene | null;

  public abstract render(canvas: HTMLCanvasElement): void;
};
