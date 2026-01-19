import Scene from './Scene.js';
import KeyListener from '../KeyListener.js';
import Vector2 from '../Vector2.js';
import CanvasRenderer from '../CanvasRenderer.js';
import ScenePause from './ScenePause.js';
import RacetrackScene from './RacetrackScene.js';
import Racetrack1 from './Racetrack1.js';
import Racetrack2 from './Racetrack2.js';
import Racetrack3 from './Racetrack3.js';
import { pitstopQuestions } from '../questions/pitstopQuestions.js';

export default class ScenePitstop extends Scene {
  private previousScene: RacetrackScene;

  private pause: boolean = false;

  private resumeRace: boolean = false;

  private dialogue: string[] = [
    'Hoi! Ik ben Walter de wasbeer.',
    'Je auto is kapot:(',
    'Beantwoord 3 vragen juist om je auto te maken!',
  ];

  private questions: { question: string; missing: string }[];

  private currentQuestionIndex: number;

  private questionsAnswered: number = 0;

  private maxQuestions: number = 3;

  private state: 'dialogue' | 'questions' | 'finished' = 'dialogue';

  private currentDialogueIndex: number = 0;

  public constructor(
    boardSize: Vector2,
    canvas: HTMLCanvasElement,
    previousScene: RacetrackScene
  ) {
    super(boardSize, canvas);
    this.previousScene = previousScene;
    this.background = CanvasRenderer.loadNewImage('./assets/backgrounds/pitstop.png');

    this.questions = pitstopQuestions.normal;
    this.currentQuestionIndex = Math.floor(Math.random() * this.questions.length);
  }

  /**
   * Processes the input
   *
   * @param keyListener keylistener that is being used
   * @param mouseListener mouselistener that is being used
   */
  public override processInput(keyListener: KeyListener): void {
    // Pause when ESC is pressed
    if (keyListener.keyPressed(KeyListener.KEY_ESC)) {
      this.pause = true;
    }

    // Go to the next dialogue when SPACE is pressed
    if (this.state === 'dialogue') {
      if (keyListener.keyPressed(KeyListener.KEY_SPACE)) {
        this.currentDialogueIndex += 1;
      }
    }

    // Resume the stopwatch when the dialogue is over
    if (this.state === 'questions') {
      this.previousScene.resumeTimer();
      const currentQuestion:
        { question: string; missing: string } |
        undefined = this.questions[this.currentQuestionIndex];
      if (!currentQuestion) {
        return;
      }
      if(
        (currentQuestion.missing == '!') && keyListener.keyPressed(KeyListener.KEY_1) && keyListener.keyPressed(KeyListener.KEY_SHIFT_LEFT) ||
        (currentQuestion.missing == '?') && keyListener.keyPressed(KeyListener.KEY_SLASH) && keyListener.keyPressed(KeyListener.KEY_SHIFT_LEFT,) ||
        (currentQuestion.missing == '.') && keyListener.keyPressed(KeyListener.KEY_PERIOD) ||
        (currentQuestion.missing == ',') && keyListener.keyPressed(KeyListener.KEY_COMMA)
      ) {
        this.questionsAnswered += 1;
        this.currentQuestionIndex += 1;
        if (this.currentQuestionIndex >= this.questions.length) {
          this.currentQuestionIndex = 0;
        }
        if (this.questionsAnswered == this.maxQuestions) {
          this.state = 'finished';
          this.resumeRace = true;
        }
      }
    }
  }

  /**
   * Updates the game
   *
   * @param delta time elapsed
   */
  public override update(delta: number): void {
    if (this.currentDialogueIndex >= this.dialogue.length) {
      this.state = 'questions'; // Change the state to questions when the dialogue is done
      this.previousScene.update(delta); // Only update racetrack when the dialogue is done
    }
    if (this.state == 'questions') {
      this.previousScene.getCar().getHealth().heal(100);
      if (this.previousScene instanceof Racetrack1) {
        this.previousScene.getCar().setPitstopPosition1(this.previousScene.getCanvas());
      }
      if (this.previousScene instanceof Racetrack2) {
        this.previousScene.getCar().setPitstopPosition2(this.previousScene.getCanvas());
      }
      if (this.previousScene instanceof Racetrack3) {
        this.previousScene.getCar().setPitstopPosition3(this.previousScene.getCanvas());
      }
    }
  }

  public override getNextScene(): Scene | null {
    if (this.pause) {
      this.pause = false;
      return new ScenePause(this.boardSize, this.canvas, this);
    }

    if (this.resumeRace) {
      this.resumeRace = false;
      this.previousScene.getCar().resetPitstopFlags();
      return this.previousScene;
    }
    return null;
  }

  /**
   * Renders all the things in scenepitstop
   *
   * @param canvas the canvas it needs to be rendered on
   * @returns yes
   */
  public render(canvas: HTMLCanvasElement): void {
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    // Render the racetrack behind the pitstopscene
    this.previousScene.render(canvas);

    // Render the pitstop overlay (Background and Walter)
    ctx.drawImage(this.background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(this.walter, this.boardSize.x * 0.00001, this.boardSize.y - this.walter.height);
    const rectWidth: number = this.boardSize.x / 3;
    const rectHeight: number = this.boardSize.y / 5;
    const rectangleX: number = (canvas.width - rectWidth) / 2;
    const rectangleY: number = this.boardSize.y * 0.1;
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(rectangleX, rectangleY, rectWidth, rectHeight);


    // Timer
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(this.previousScene.getFormattedTime(), canvas.width - 20, 40);

    // Render dialogue and questions
    if (this.state == 'dialogue') {
      ctx.font = '24px Arial';
      ctx.textAlign = 'left';
      const text: string = this.dialogue[this.currentDialogueIndex] ?? '';
      ctx.fillStyle = 'White';
      CanvasRenderer.writeText(canvas, text, this.boardSize.x / 2, this.boardSize.y / 2 - 350, 'center', 'Arial', 24, 'white');
      CanvasRenderer.writeText(canvas, 'Druk op SPATIE om verder te gaan...', this.boardSize.x / 2, this.boardSize.y / 2 - 300, 'center', 'Arial', 24, 'white');
    }
    if (this.state == 'questions') {
      const currentQuestion:
        { question: string; missing: string } |
        undefined = this.questions[this.currentQuestionIndex];
      if (!currentQuestion) {
        return;
      }
      CanvasRenderer.writeText(canvas, currentQuestion.question, this.boardSize.x / 2, this.boardSize.y / 2 - 350, 'center', 'Arial', 24, 'white');
      CanvasRenderer.writeText(canvas, 'Typ het ontbrekende leesteken!', this.boardSize.x / 2, this.boardSize.y / 3 - 100, 'center', 'Arial', 24, '#9e7070ff');
    }
  }
}
