import Scene from './Scene.js';
import KeyListener from '../KeyListener.js';
import MouseListener from '../MouseListener.js';
import Vector2 from '../Vector2.js';
import CanvasRenderer from '../CanvasRenderer.js';
import ScenePause from './ScenePause.js';
import RacetrackScene from './RacetrackScene.js';

export default class ScenePitstop extends Scene {
  private previousScene: RacetrackScene;

  private pause: boolean = false;

  private resumeRace: boolean = false;

  private dialog: string[] = [
    'Hoi! Ik ben Walter de wasbeer.',
    'Welkom bij de pitstop! Hier kun je zorgen dat je auto weer health krijgt!',
    'Beantwoord zo snel mogelijk de vragen zodat je weer met een gerepareerde auto kan racen!',
  ];

  private questions: {text: string; missing: string}[] = [
    { text: 'Er moet een leesteken in deze zin', missing: '.' },
    { text: 'Tijd om te racen', missing: '!' },
    { text: 'We zijn bijna klaar, toch', missing: '?' },
    { text: 'Dit is er belangrijk , schreeuwde hij.', missing: '!' }
  ];

  private currentQuestionIndex: number = 0;

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
  }

  /**
   * Processes the input
   *
   * @param keyListener keylistener that is being used
   * @param mouseListener mouselistener that is being used
   */
  public override processInput(keyListener: KeyListener, mouseListener: MouseListener): void {
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
        (currentQuestion.missing == '!') && keyListener.keyPressed(KeyListener.KEY_1) && keyListener.keyPressed(KeyListener.KEY_SHIFT_LEFT)||
        (currentQuestion.missing == '?') && keyListener.keyPressed(KeyListener.Key_Slash) && keyListener.keyPressed(KeyListener.KEY_SHIFT_LEFT,)||
        (currentQuestion.missing == '.') && keyListener.keyPressed(KeyListener.Key_Period)||
        (currentQuestion.missing == ',') && keyListener.keyPressed(KeyListener.Key_Comma)
      ) {
        this.questionsAnswered += 1;
        this.currentQuestionIndex += 1;
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
      this.previousScene.getCar().resetPosition(this.previousScene.getCanvas());
    }
  }

  public override getNextScene(): Scene | null {
    if (this.pause) {
      this.pause = false;
      return new ScenePause(this.boardSize, this.canvas, this);
    }

    if (this.resumeRace) {
      this.resumeRace = false;
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


    CanvasRenderer.writeText(canvas, 'Pitstop', this.boardSize.x / 2, this.boardSize.y / 2);

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
      CanvasRenderer.writeText(canvas, currentQuestion.text, this.boardSize.x / 2, 50, 'center', 'Arial', 30,);
      CanvasRenderer.writeText(canvas, 'Typ het ontbrekende leesteken!', this.boardSize.x/2, 90, 'center', 'Arial', 24, 'white');
    }
  }
}
