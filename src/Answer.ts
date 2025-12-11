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

  private car: Car;

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
    this.car = new Car(1200, 1200);
  }

  public checkCollision(car: Car): boolean {
    if (this.posX + 30 >= car.getPosX()
      && this.posX <= car.getPosX() + car.getWidth()
      && this.posY + 30 >= car.getPosY()
      && this.posY <= car.getPosY() + car.getHeight()) {
      return true;
    }
    return false;
  }

  public isCorrectAnswer(): boolean {
    return this.isCorrect;
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
