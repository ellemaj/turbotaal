import Car from './Car.js';
import CanvasItem from './CanvasItem.js';
import CanvasRenderer from './CanvasRenderer.js';

export default class Answer extends CanvasItem {
  private answerText: string;

  private isCorrect: boolean;

  private active: boolean;

  private boostAmount: number;

  private boostDuration: number;

  private correctAnswerCounter: number;

  public constructor() {
    super();
    this.active = false;
    this.boostAmount = 0;
    this.boostDuration = 0;
    this.correctAnswerCounter = 0;
    this.answerText = 'TESTTEXT';
    this.isCorrect = false;
    this.posX = 800;
    this.posY = 400;
  }

  public checkCollision(car: Car): void {
    //TODO: hitbox, the box should have a hitbox

    // if (item.X + item.width >= player.X
    // && item.X <= player.X + player.width
    // && item.Y + item.height >= player.Y
    // && item.Y <= player.Y + player.height)
  }

  public isCorrectAnswer(): boolean {
    return this.isCorrect;
  }

  public drawAnswer(canvas: HTMLCanvasElement): void {
    CanvasRenderer.drawAnswerBox(canvas, this.posX, this.posY, 150, 60, 'blue', this.answerText);
  }

  public static from(text: string, isCorrect: boolean = false): Answer {
    const a: Answer = new Answer();
    a.answerText = text;
    a.isCorrect = isCorrect;
    a.posX = 200;
    a.posY = 100;
    return a;
  }

  public getText(): string {
    return this.answerText;
  }

  public setPosition(x: number, y: number): void {
    this.posX = x;
    this.posY = y;
  }
}
//krijg shit op canvas en answertext moet in de box komen te staan. de box heeft dan een hitbox.
