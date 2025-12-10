import Game from './Game.js';
import Scene from './scenes/Scene.js';
import SceneStart from './scenes/SceneStart.js';
import SceneTrackSelection from './scenes/SceneTrackSelection.js';
import SceneShop from './scenes/SceneShop.js';
import Vector2 from './Vector2.js';
import KeyListener from './KeyListener.js';
import MouseListener from './MouseListener.js';
import CanvasRenderer from './CanvasRenderer.js';
import Car from './Car.js';

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
    this.currentScene.processInput(this.keyListener, this.mouseListener);

    if (this.keyListener.isKeyDown(KeyListener.KEY_LEFT)) {
      this.car.movingLeft = true;
    } else {
      this.car.movingLeft = false;
    }
    if (this.keyListener.isKeyDown(KeyListener.KEY_RIGHT)) {
      this.car.movingRight = true;
    } else {
      this.car.movingRight = false;
    }
    if (this.keyListener.isKeyDown(KeyListener.KEY_UP)) {
      this.car.movingUp = true;
    } else {
      this.car.movingUp = false;
    }
    if (this.keyListener.isKeyDown(KeyListener.KEY_DOWN)) {
      this.car.movingDown = true;
    } else {
      this.car.movingDown = false;
    }
    // if (this.mouseListener.isButtonDown(MouseListener.BUTTON_LEFT)) {
    // }
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

    if (!(this.currentScene instanceof SceneStart)) {
      this.car.render(this.canvas);
    }
  }
}
