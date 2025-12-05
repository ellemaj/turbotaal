import KeyListener from '../KeyListener.js';
import Vector2 from '../Vector2.js';

export default abstract class Scene{
  protected boardSize: Vector2;

  public constructor(boardSize: Vector2) {
    this.boardSize = boardSize;
  }

  public abstract processInput(keyListener: KeyListener): void;
  public abstract update(delta: number): void;
  public abstract getNextScene(): Scene | null;
  public abstract render(canvas: HTMLCanvasElement): void;
};
