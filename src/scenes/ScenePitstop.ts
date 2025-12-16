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
    'Yap yap yap yap yap',
    'druk op R om terug te gaan naar de race',
    'eigenlijk moet dit gebeuren als de vragen klaar zijn maar dat is er nog niet',
  ];

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
    // Opens the pauseScene
    if (keyListener.keyPressed(KeyListener.KEY_ESC)) {
      this.pause = true;
    }

    // Goes to the next dialog
    if (keyListener.keyPressed(KeyListener.KEY_SPACE) && !this.dialogFinished) {
      this.currentDialogIndex += 1;
      if (this.currentDialogIndex >= this.dialog.length) {
        this.dialogFinished = true;
        this.previousScene.resumeTimer();
      }
    }

    // Sets resumeRace to true
    if (keyListener.keyPressed(KeyListener.KEY_R) && this.dialogFinished) { // Only for debugging!!
      this.resumeRace = true;
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
    if (!this.dialogFinished) {
      ctx.font = '24px Arial';
      ctx.textAlign = 'left';
      const text: string = this.dialog[this.currentDialogIndex] ?? '';
      ctx.fillStyle = 'White';
      CanvasRenderer.writeText(canvas, text, this.boardSize.x / 2, this.boardSize.y / 2 - 350, 'center', 'Arial', 24, 'white');
      CanvasRenderer.writeText(canvas, 'Druk op SPATIE om verder te gaan...', this.boardSize.x / 2, this.boardSize.y / 2 - 300, 'center', 'Arial', 24, 'white');
    }
  }
}
