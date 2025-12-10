import Scene from './Scene.js';
import Vector2 from '../Vector2.js';

export default abstract class RacetrackScene extends Scene {
  public constructor(boardSize: Vector2, canvas: HTMLCanvasElement) {
    super(boardSize, canvas);
  }
}
