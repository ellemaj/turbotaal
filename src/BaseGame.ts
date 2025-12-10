import Game from './Game.js';
import Car from './Car.js';
import CanvasRenderer from './CanvasRenderer.js';
import KeyListener from './KeyListener.js';
import MouseListener from './MouseListener.js';
import StartScreen from './StartScreen.js';

export default class BaseGame extends Game {
  private canvas: HTMLCanvasElement;

  private keyListener: KeyListener;

  private mouseListener: MouseListener;

  private car: Car;

  private startScreen: StartScreen;

  public constructor(canvas: HTMLCanvasElement) {
    super();
    this.startScreen = new StartScreen(canvas);
    this.canvas = canvas;
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;
    this.keyListener = new KeyListener();
    this.mouseListener = new MouseListener(canvas);
    this.car = new Car(this.canvas.width, this.canvas.height);
  }

  /**
   * Process all input. Called from the GameLoop.
   */
  public processInput(): void {
    if(this.keyListener.isKeyDown(KeyListener.KEY_LEFT)) {
      this.car.movingLeft = true;
    } else {
      this.car.movingLeft = false;
    }
    if(this.keyListener.isKeyDown(KeyListener.KEY_RIGHT)) {
      this.car.movingRight = true;
    } else {
      this.car.movingRight = false;
    }
    if(this.keyListener.isKeyDown(KeyListener.KEY_UP)) {
      this.car.movingUp = true;
    } else {
      this.car.movingUp = false;
    }
    if(this.keyListener.isKeyDown(KeyListener.KEY_DOWN)) {
      this.car.movingDown = true;
    } else {
      this.car.movingDown = false;
    }
    if (this.mouseListener.isButtonDown(MouseListener.BUTTON_LEFT)){
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
    this.startScreen.update();
    if (this.startScreen.isActive()){
      return true;
    }
    this.car.update(delta, this.canvas);
    return true;
  }

  /**
   * Render all the elements in the screen.
   */
  public render(): void {
    // Clear the canvas
    CanvasRenderer.clearCanvas(this.canvas);
    if (this.startScreen.isActive()){
      this.startScreen.render(this.canvas);
      return;
    }
    this.car.render(this.canvas);
  }
}
