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
import { COLUMNS1, ROWS1, COLLISIONS1 } from './scenes/CollisionDataTrack1.js';
import { COLUMNS2, ROWS2, COLLISIONS2 } from './scenes/CollisionDataTrack2.js';
import { COLUMNS3, ROWS3, COLLISIONS3 } from './scenes/CollisionDataTrack3.js';
import Racetrack1 from './scenes/Racetrack1.js';
import Racetrack2 from './scenes/Racetrack2.js';
import Racetrack3 from './scenes/Racetrack3.js';
import { AnswerBox } from './data/Answerbox.js';

export default class BaseGame extends Game {
  private canvas: HTMLCanvasElement;

  private keyListener: KeyListener;

  private mouseListener: MouseListener;

  private currentScene: Scene;

  private question: Question;

  private grid: Grid;

  private lastMessage: string | null = null;

  private lastMessageTTL: number = 0; // seconds to show message

  private answerLocked: boolean = false; // prevent answering while waiting

  private effectTimer: number = 0; // seconds remaining for temporary effect

  private savedMaxSpeed: number | null = null;

  private savedTurnSpeed: number | null = null;

  private camera: Camera;

  protected answerBoxes: AnswerBox[] = [];

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

    this.currentScene = new SceneStart(
      new Vector2(this.canvas.width, this.canvas.height),
      this.canvas);

    // Initialize grid to a default, gets chosen later by the grid-chooser-inator
    this.grid = new Grid(0, 0, []);

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
      const currentHealth: number = car.getHealth().getHealth();
      // only accept answers when not locked
      if (!this.answerLocked) {
        if (car.collisionBox1) {
          const correct: boolean = this.question.checkAnswerAt(0);
          this.lastMessage = correct ? 'Correct!' : 'Fout';
          this.lastMessageTTL = 3;
          // 10 sec boost :)
          this.effectTimer = 2;
          this.savedMaxSpeed = car.maxSpeed;
          this.savedTurnSpeed = car.turnSpeed;
          if (correct) {
            car.maxSpeed = this.savedMaxSpeed + 0.075;
            car.turnSpeed = this.savedTurnSpeed - 0.5;
          } else {
            car.maxSpeed = this.savedMaxSpeed - 0.075;
            car.turnSpeed = this.savedTurnSpeed + 0.5;
          }
          car.collisionBox1 = false;
          this.answerLocked = true;
        }
        if (car.getCollisionBox2()) {
          const correct: boolean = this.question.checkAnswerAt(1);
          this.lastMessage = correct ? 'Correct!' : 'Fout';
          this.lastMessageTTL = 3;
          this.answerLocked = true;
          this.effectTimer = 2;
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
        if (car.getCollisionBox3()) {
          const correct: boolean = this.question.checkAnswerAt(2);
          this.lastMessage = correct ? 'Correct!' : 'Fout';
          this.lastMessageTTL = 3;
          this.answerLocked = true;
          this.effectTimer = 2;
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
      car.update(delta, this.canvas, this.grid, this.answerBoxes);
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
      // Grid-chooser-inator
      if (this.currentScene instanceof Racetrack1) {
        this.grid = new Grid(COLUMNS1, ROWS1, COLLISIONS1);
      } else if (this.currentScene instanceof Racetrack2) {
        this.grid = new Grid(COLUMNS2, ROWS2, COLLISIONS2);
      } else if (this.currentScene instanceof Racetrack3) {
        this.grid = new Grid(COLUMNS3, ROWS3, COLLISIONS3);
      }
    }
    return true;
  }

  /**
   *slow the car down if low health
   */

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
      //rendering the healthbar
      const currentHealth: number = car.getHealth().getHealth();
      const maxHealth: number = 100;
      const healthWidth: number = 0.1 * (this.canvas.width);
      const healthHeight: number = 0.02 * (this.canvas.height);
      const posX: number = 0.90 * (this.canvas.width);
      const posY: number = 0.10 * (this.canvas.height);
      ctx.fillStyle = '#f2f2f2';
      ctx.fillRect(posX, posY, healthWidth, healthHeight);
      // if statements to check which healthbar and text
      if (currentHealth > 70) {
        ctx.fillStyle = '#4caf50';
        ctx.fillRect( posX, posY, currentHealth / maxHealth * healthWidth, healthHeight);
        CanvasRenderer.writeText(this.canvas, 'Je auto is heel!', posX + (0.05 * this.canvas.width), posY - (0.01 * this.canvas.height), 'center', 'Arial', 24, '#f5f5f5');
      }
      if (currentHealth < 70 && currentHealth > 43) {
        ctx.fillStyle = '#fbc02d';
        ctx.fillRect( posX, posY, currentHealth / maxHealth * healthWidth, healthHeight);
        CanvasRenderer.writeText(this.canvas, 'Je auto heeft lichte schade', posX + (0.03 * this.canvas.width), posY - (0.01 * this.canvas.height), 'center', 'Arial', 24, '#f5f5f5');
      }
      if (currentHealth < 43 && currentHealth > 20) {
        ctx.fillStyle = '#e53935';
        ctx.fillRect( posX, posY, currentHealth / maxHealth * healthWidth, healthHeight);
        CanvasRenderer.writeText(this.canvas, 'Je auto is bijna kapot, bereid je voor op de pitstop!', posX - (0.03 * this.canvas.width), posY - (0.01 * this.canvas.height), 'center', 'Arial', 24, '#f5f5f5');
      }
    }
  }
}
