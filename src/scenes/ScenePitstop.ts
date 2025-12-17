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
    'Beantwoord de vragen zo snel mogelijk om verder te racen!',
    'druk op R om terug te gaan naar de race',
    'eigenlijk moet dit gebeuren als de vragen klaar zijn maar dat is er nog niet',
  ];

  private questions: { text: string; missing: string }[] = [
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

  private dialogFinished: boolean = false;

  public constructor(
    boardSize: Vector2,
    canvas: HTMLCanvasElement,
    previousScene: RacetrackScene
  ) {
    super(boardSize, canvas);
    this.previousScene = previousScene;
    this.background = CanvasRenderer.loadNewImage('./assets/pitstop.png');
  }

  /**
   * Processes the input
   *
   * @param keyListener keylistener that is being used
   * @param mouseListener mouselistener that is being used
   */
  public override processInput(keyListener: KeyListener, mouseListener: MouseListener): void {
    if (this.state === 'dialog') {
      if (keyListener.keyPressed(KeyListener.KEY_SPACE)) {
        this.state = 'questions';
        this.dialogFinished = true;
      }
    }
    if (this.state === 'questions') {
      const currentQuestion:
        { text: string; missing: string } | undefined = this.questions[this.currentQuestionIndex];
      if (!currentQuestion) {
        return;
      }
      if (
        (currentQuestion.missing == '!') && keyListener.keyPressed(KeyListener.KEY_1) ||
        (currentQuestion.missing == '?') && keyListener.keyPressed(KeyListener.KEY_2) ||
        (currentQuestion.missing == '.') && keyListener.keyPressed(KeyListener.KEY_3) ||
        (currentQuestion.missing == ',') && keyListener.keyPressed(KeyListener.KEY_4)
      ) {
        this.questionsAnswered++;
        this.currentQuestionIndex++;
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
    if (this.dialogFinished) {
      this.previousScene.update(delta); // Only update racetrack when the dialog is done
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

    // Start the questions when dialog is finished
    if (this.dialogFinished) {
      // add questions here
      return null;
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

    // Render dialog when it isnt finished
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
      if (!currentQuestion) return;
      CanvasRenderer.writeText(canvas, currentQuestion.text, this.boardSize.x / 2, 50, 'center', 'Arial', 30,);
      CanvasRenderer.writeText(canvas, 'Typ het ontbrekende leesteken!', this.boardSize.x/2, 90, 'center', 'Arial', 24, 'white');
      CanvasRenderer.writeText(canvas, 'Toets 1 voor!|Toets 2 voor ?| Toets 3 voor .Toets 4 voor ,', this.boardSize.x/2, 20, 'center', 'Arial', 24, );
    }
  }
}
