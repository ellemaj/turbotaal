import CanvasRenderer from '../CanvasRenderer.js';
import KeyListener from '../KeyListener.js';
import Vector2 from '../Vector2.js';
import Racetrack1 from './Racetrack1.js';
import Racetrack2 from './Racetrack2.js';
import Racetrack3 from './Racetrack3.js';
import Racetrack4 from './Racetrack4.js';
import SceneStart from './SceneStart.js';
import Scene from './Scene.js';

export default class SceneTrackSelection extends Scene {
  private raceTrack1: boolean;

  private raceTrack2: boolean;

  private raceTrack3: boolean;

  private raceTrack4: boolean;

  private goBack: boolean;

  public constructor(boardSize: Vector2, canvas: HTMLCanvasElement) {
    super(boardSize, canvas);
    this.raceTrack1 = false; // Only for the school demo!
    this.raceTrack2 = false;
    this.raceTrack3 = false;
    this.raceTrack4 = false;
    this.goBack = false;
  }

  /**
   * Goes to the racetrack when the right key is pressed
   *
   * @param keyListener Looks if the key is being pressed
   */
  public override processInput(keyListener: KeyListener): void {
    if (keyListener.keyPressed(KeyListener.KEY_1)) {
      this.raceTrack1 = true;
    } else if (keyListener.keyPressed(KeyListener.KEY_2)) {
      this.raceTrack2 = true;
    } else if (keyListener.keyPressed(KeyListener.KEY_3)) {
      this.raceTrack3 = true;
    } else if (keyListener.keyPressed(KeyListener.KEY_4)) {
      this.raceTrack4 = true;
    } else if (keyListener.keyPressed(KeyListener.KEY_ESC)) {
      this.goBack = true;
    }
  }

  /**
   * /
   * @param delta /
   * @returns /
   */
  public override update(delta: number): void {
    return;
  }

  public override getNextScene(): Scene | null {
    if(this.raceTrack1) {
      return new Racetrack1(this.boardSize, this.canvas);
    } else if (this.raceTrack2) {
      return new Racetrack2(this.boardSize, this.canvas);
    } else if (this.raceTrack3) {
      return new Racetrack3(this.boardSize, this.canvas);
    } else if (this.raceTrack4) {
      return new Racetrack4(this.boardSize, this.canvas);
    } else if (this.goBack) {
      return new SceneStart(this.boardSize, this.canvas);
    }
    return null;
  }

  /**
   * //
   *
   * @param canvas the canvas it needs to be rendered on
   */
  public override render(canvas: HTMLCanvasElement): void {
    CanvasRenderer.writeText(
      canvas,
      'Welcome to the track selection!',
      this.boardSize.x / 2,
      this.boardSize.y / 2 - 50);

    CanvasRenderer.writeText(
      canvas,
      'Press the number key of what track you wanna play, or press escape to go back.',
      this.boardSize.x / 2,
      this.boardSize.y / 2);
  }
}
