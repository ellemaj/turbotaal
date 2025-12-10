import Game from './Game.js';
import Scene from './scenes/Scene.js';
import RacetrackScene from './scenes/RacetrackScene.js';
import SceneStart from './scenes/SceneStart.js';
import SceneTrackSelection from './scenes/SceneTrackSelection.js';
import SceneShop from './scenes/SceneShop.js';
import Vector2 from './Vector2.js';
import KeyListener from './KeyListener.js';
import MouseListener from './MouseListener.js';
import CanvasRenderer from './CanvasRenderer.js';
import Car from './Car.js';

// import Racetrack1 from './scenes/Racetrack1.js';
// import Racetrack4 from './scenes/Racetrack4.js';
// import Racetrack2 from './scenes/Racetrack2.js';
// import Racetrack3 from './scenes/Racetrack3.js';
// import Racetrack4 from './scenes/Racetrack4.js';

export default class BaseGame extends Game {
  private canvas: HTMLCanvasElement;

  private keyListener: KeyListener;

  private mouseListener: MouseListener;

  private car: Car;

  private currentScene: Scene;

  public constructor(canvas: HTMLCanvasElement) {
    super();
    this.canvas = canvas;
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;

    this.keyListener = new KeyListener();
    this.mouseListener = new MouseListener(canvas);
    this.car = new Car(this.canvas.width, this.canvas.height);

    this.currentScene = new SceneStart(new Vector2(
      this.canvas.width,
      this.canvas.height),
    this.canvas);
  }

  /**
   * Process all input. Called from the GameLoop.
   */
  public processInput(): void {
    // Let the current scene process the input
    this.currentScene.processInput(this.keyListener, this.mouseListener);

    // Only let the car move in the racetrack-scenes
    if (this.currentScene instanceof RacetrackScene) {
      this.car.movingLeft = this.keyListener.isKeyDown(KeyListener.KEY_LEFT);
      this.car.movingRight = this.keyListener.isKeyDown(KeyListener.KEY_RIGHT);
      this.car.movingUp = this.keyListener.isKeyDown(KeyListener.KEY_UP);
      this.car.movingDown = this.keyListener.isKeyDown(KeyListener.KEY_DOWN);
    } else {
      this.car.movingLeft = false;
      this.car.movingRight = false;
      this.car.movingUp = false;
      this.car.movingDown = false;
    }
  }

  /**
   * Update game state. Called from the GameLoop
   *
   * @param delta time in ms elapsed from the GameLoop
   * @returns true if the game should continue
   */
  public update(delta: number): boolean {
    this.processInput();

    this.currentScene.update(delta);

    // Only update the car in Racetrack-scenes
    if (this.currentScene instanceof RacetrackScene) {
      this.car.update(delta, this.canvas);
    }

    // Change scenes
    const nextScene: Scene | null = this.currentScene.getNextScene();
    if (nextScene) {
      this.currentScene = nextScene;
    }
    return true;
  }

  /**
   * Render all the elements in the screen.
   */
  public render(): void {
    CanvasRenderer.clearCanvas(this.canvas);

    // Render the current scene
    this.currentScene.render(this.canvas);

    // Render the car only in racetrack-scenes
    if (this.currentScene instanceof RacetrackScene) {
      this.car.render(this.canvas);
    }
  }
}
