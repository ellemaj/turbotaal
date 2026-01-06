import Game from './Game.js';
import Scene from './scenes/Scene.js';
import SceneStart from './scenes/SceneStart.js';
import RacetrackScene from './scenes/RacetrackScene.js';
import Vector2 from './Vector2.js';
import KeyListener from './KeyListener.js';
import MouseListener from './MouseListener.js';
import CanvasRenderer from './CanvasRenderer.js';
import Car from './Car.js';
import Question from './Question.js';
import { verkleinwoorden } from './questions/verkleinwoorden.js';
import Camera from './Camera.js';
import Grid from './Grid.js';
import { COLUMNS, ROWS, COLLISIONS } from './scenes/CollisionDataTrack1.js';
import Racetrack1 from './scenes/Racetrack1.js';

export default class BaseGame extends Game {
  private canvas: HTMLCanvasElement;

  private keyListener: KeyListener;

  private mouseListener: MouseListener;

  private currentScene: Scene;

  private question: Question;

  private grid: Grid;

  private racetrack1: Racetrack1;

  private lastMessage: string | null = null;

  private lastMessageTTL: number = 0; // seconds to show message

  private answerLocked: boolean = false; // prevent answering while waiting

  private effectTimer: number = 0; // seconds remaining for temporary effect

  private savedMaxSpeed: number | null = null;

  private savedTurnSpeed: number | null = null;

  private camera: Camera;

  public constructor(canvas: HTMLCanvasElement) {
    super();
    this.canvas = canvas;
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;

    this.keyListener = new KeyListener();
    this.mouseListener = new MouseListener(canvas);

    this.question = new Question();
    // load a default question so it can be rendered
    this.question.loadFromData(verkleinwoorden.normal[
      Math.floor(Math.random() * verkleinwoorden.normal.length)]!);

    // position the question once (centered)
    this.question.setPosition(this.canvas.width / 2, 100);

    this.grid = new Grid(COLUMNS, ROWS, COLLISIONS);
    this.racetrack1 = new Racetrack1(new Vector2(canvas.width, canvas.height), canvas, this.grid);

    this.currentScene = new SceneStart(
      new Vector2(this.canvas.width, this.canvas.height),
      this.canvas);

    this.camera = new Camera(
      this.canvas.width,
      this.canvas.height,
      1920,
      1280,
      1.8
    );
  }

  /**
   * Process all input. Called from the GameLoop.
   */
  public processInput(): void {
    // Let the current scene process the input
    this.currentScene.processInput(this.keyListener, this.mouseListener);

    if (this.currentScene instanceof RacetrackScene) {
      const car: Car = this.currentScene.getCar();
      // only accept answers when not locked
      if (!this.answerLocked) {
        if (this.keyListener.keyPressed(KeyListener.KEY_1)) {
          const correct: boolean = this.question.checkAnswerAt(0);
          this.lastMessage = correct ? 'Correct!' : 'Fout';
          this.lastMessageTTL = 10;
          // 10 sec boost :)
          this.answerLocked = true;
          this.effectTimer = 5;
          this.savedMaxSpeed = car.maxSpeed;
          this.savedTurnSpeed = car.turnSpeed;
          if (correct) {
            car.maxSpeed = this.savedMaxSpeed + 0.075;
            car.turnSpeed = this.savedTurnSpeed - 0.5;
          } else {
            car.maxSpeed = this.savedMaxSpeed - 0.075;
            car.turnSpeed = this.savedTurnSpeed + 0.5;
          }
        }
        if (this.keyListener.keyPressed(KeyListener.KEY_2)) {
          const correct: boolean = this.question.checkAnswerAt(1);
          this.lastMessage = correct ? 'Correct!' : 'Fout';
          this.lastMessageTTL = 10;
          this.answerLocked = true;
          this.effectTimer = 5;
          this.savedMaxSpeed = car.maxSpeed;
          this.savedTurnSpeed = car.turnSpeed;
          if (correct) {
            car.maxSpeed = this.savedMaxSpeed + 0.075;
            car.turnSpeed = this.savedTurnSpeed - 0.5;
          } else {
            car.maxSpeed = this.savedMaxSpeed - 0.075;
            car.turnSpeed = this.savedTurnSpeed + 0.5;
          }
        }
        if (this.keyListener.keyPressed(KeyListener.KEY_3)) {
          const correct: boolean = this.question.checkAnswerAt(2);
          this.lastMessage = correct ? 'Correct!' : 'Fout';
          this.lastMessageTTL = 10;
          this.answerLocked = true;
          this.effectTimer = 5;
          this.savedMaxSpeed = car.maxSpeed;
          this.savedTurnSpeed = car.turnSpeed;
          if (correct) {
            car.maxSpeed = this.savedMaxSpeed + 0.075;
            car.turnSpeed = this.savedTurnSpeed - 0.5;
          } else {
            car.maxSpeed = this.savedMaxSpeed - 0.075;
            car.turnSpeed = this.savedTurnSpeed + 0.5;
          }
        }
      }
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
      const car: Car = this.currentScene.getCar();
      car.update(delta, this.canvas, this.grid);
    }

    if (this.currentScene instanceof RacetrackScene) {
      const car: Car = this.currentScene.getCar();
      this.camera.follow(car.getPosition());
    }

    // decrement message TTL
    if (this.lastMessageTTL > 0) {
      this.lastMessageTTL -= delta / 1000;
      if (this.lastMessageTTL <= 0) {
        this.lastMessage = null;
        this.lastMessageTTL = 0;
      }
    }

    // decrement effect timer and revert + load next question when expired
    if (this.effectTimer > 0) {
      this.effectTimer -= delta / 1000;
      if (this.effectTimer <= 0) {
        // revert car stats if we saved them
        if (this.currentScene instanceof RacetrackScene) {
          const car: Car = this.currentScene.getCar();
          if (this.savedMaxSpeed !== null) {
            car.maxSpeed = this.savedMaxSpeed;
          }
          if (this.savedTurnSpeed !== null) {
            car.turnSpeed = this.savedTurnSpeed;
          }
        }
        this.savedMaxSpeed = null;
        this.savedTurnSpeed = null;
        this.effectTimer = 0;
        this.answerLocked = false;

        // load a new random question and position it
        this.question.loadFromData(verkleinwoorden.normal[
          Math.floor(Math.random() * verkleinwoorden.normal.length)]!);
        this.question.setPosition(this.canvas.width / 2, 100);
        this.lastMessage = null;
        this.lastMessageTTL = 0;
      }
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
    const ctx: CanvasRenderingContext2D | null =
      this.canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.currentScene instanceof RacetrackScene) {
      ctx.save();
      this.camera.apply(ctx);
    }

    // Render the current scene
    this.currentScene.render(this.canvas);

    window.addEventListener('keydown', (e: KeyboardEvent) => {
      const blockedKeys: string[] = [
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        ' '
      ];

      if (blockedKeys.includes(e.key)) {
        e.preventDefault();
      }
    });

    // Render the car and Q&A only in racetrack-scenes
    if (this.currentScene instanceof RacetrackScene) {
      const car: Car = this.currentScene.getCar();
      const question: Question = this.currentScene.getQuestion();
      car.render(this.canvas);
      question.draw(this.canvas);
      ctx.restore();
      // NOW ctx restore, so everything after is always on screen and not on the map (UI elements)
      this.question.draw(this.canvas);
      if (this.lastMessage) {
        CanvasRenderer.writeText(this.canvas, this.lastMessage, this.canvas.width / 2, 60, 'center', 'Arial', 36, this.lastMessage === 'Correct!' ? 'green' : 'red');
      }
      const track1: Racetrack1 = this.currentScene as Racetrack1;
      track1.renderLapcount();
      track1.renderTimer();
    }
  }
}
