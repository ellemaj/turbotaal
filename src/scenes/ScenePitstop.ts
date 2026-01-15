import Scene from './Scene.js';
import KeyListener from '../KeyListener.js';
import Vector2 from '../Vector2.js';
import CanvasRenderer from '../CanvasRenderer.js';
import ScenePause from './ScenePause.js';
import RacetrackScene from './RacetrackScene.js';
import Racetrack1 from './Racetrack1.js';
import Racetrack2 from './Racetrack2.js';
import Racetrack3 from './Racetrack3.js';

export default class ScenePitstop extends Scene {
  private previousScene: RacetrackScene;

  private pause: boolean = false;

  private resumeRace: boolean = false;

  private dialog: string[] = [
    'Hoi! Ik ben Walter de wasbeer.',
    'Je auto is kapot:(',
    'Beantwoord 3 vragen juist om je auto te maken!',
  ];

  private questions: { text: string; missing: string }[] = [
    { text: 'Er moet een leesteken in deze zin', missing: '.' },
    { text: 'Tijd om te racen', missing: '!' },
    { text: 'We zijn bijna klaar, toch', missing: '?' },
    {text: 'Dit is erg belangrijk , schreeuwde hij', missing: '!' },
    {text: 'Waar ga je heen', missing: '?'},
    {text: 'Leestekens zijn niet altijd makkelijk', missing: '.'},
    {text: 'Je doet het fantastisch', missing:'!'},
    {text: 'Wat is je favoriete film', missing: '?'},
    {text: 'Ik ga morgen verder', missing: '.'},
    {text: 'Pas op voor die auto', missing: '!'},
    {text: 'Ik lust geen broccoli', missing: '.'},
    {text: 'Hoelang duurt jouw pitstop', missing: '?'},
    {text: 'Op uw plaatsen...Start', missing: '!'},
    {text: 'Ben je er klaar voor', missing: '?'},
    {text: 'Ik weet nog niet wat ik vandaag ga doen', missing: '.'},
    {text: 'Het regent buiten', missing: '.'},
    {text: 'Het kind riep: ik ben gestoken door een wesp', missing: '!'},
    {text:'Ik vind gym en geschiedenis gemiddelde vakken', missing: '.'},
    {text: 'Schiet op', missing: '!'}
  ];

  private currentQuestionIndex: number;

  private questionsAnswered: number = 0;

  private maxQuestions: number = 3;

  private state: 'dialog' | 'questions' | 'finished' = 'dialog';

  private currentDialogIndex: number = 0;

  public constructor(
    boardSize: Vector2,
    canvas: HTMLCanvasElement,
    previousScene: RacetrackScene
  ) {
    super(boardSize, canvas);
    this.previousScene = previousScene;
    this.background = CanvasRenderer.loadNewImage('./assets/backgrounds/pitstop.png');
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

    // Go to the next dialog when SPACE is pressed
    if (this.state === 'dialog') {
      if (keyListener.keyPressed(KeyListener.KEY_SPACE)) {
        this.currentDialogIndex += 1;
      }
    }

    // Resume the stopwatch when the dialog is over
    if (this.state === 'questions') {
      this.previousScene.resumeTimer();
      const currentQuestion:
        { text: string; missing: string } | undefined = this.questions[this.currentQuestionIndex];
      if (!currentQuestion) {
        return;
      }
      if
      (
        (currentQuestion.missing == '!') && keyListener.keyPressed(KeyListener.KEY_1) && keyListener.keyPressed(KeyListener.KEY_SHIFT_LEFT) ||
        (currentQuestion.missing == '?') && keyListener.keyPressed(KeyListener.Key_Slash) && keyListener.keyPressed(KeyListener.KEY_SHIFT_LEFT,) ||
        (currentQuestion.missing == '.') && keyListener.keyPressed(KeyListener.Key_Period) ||
        (currentQuestion.missing == ',') && keyListener.keyPressed(KeyListener.Key_Comma)
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
    if (this.currentDialogIndex >= this.dialog.length) {
      this.state = 'questions'; // Change the state to questions when the dialog is done
      this.previousScene.update(delta); // Only update racetrack when the dialog is done
    }
    if (this.state == 'questions') {
      this.previousScene.getCar().getHealth().Heal(100);
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
    const rectWidth:number = this.boardSize.x/ 3;
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

    // Render dialog and questions
    if (this.state == 'dialog') {
      ctx.font = '24px Arial';
      ctx.textAlign = 'left';
      const text: string = this.dialog[this.currentDialogIndex] ?? '';
      ctx.fillStyle = 'White';
      CanvasRenderer.writeText(canvas, text, this.boardSize.x / 2, this.boardSize.y / 2 - 350, 'center', 'Arial', 24, 'white');
      CanvasRenderer.writeText(canvas, 'Druk op SPATIE om verder te gaan...', this.boardSize.x / 2, this.boardSize.y / 2 - 300, 'center', 'Arial', 24, 'white');
    }
    if (this.state == 'questions') {
      const currentQuestion:
        { text: string; missing: string } | undefined = this.questions[this.currentQuestionIndex];
      if (!currentQuestion) {
        return;
      }
      CanvasRenderer.writeText(canvas, currentQuestion.text, this.boardSize.x / 2, this.boardSize.y / 2 - 350, 'center', 'Arial', 24, 'white');
      CanvasRenderer.writeText(canvas, 'Typ het ontbrekende leesteken!', this.boardSize.x/2, this.boardSize.y / 3 - 100, 'center', 'Arial', 24, '#9e7070ff');
    }
  }
}
