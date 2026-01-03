import CanvasItem from './CanvasItem.js';

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

  // /**
  //  * collision
  //  * @param car the car it uses
  //  * @returns true if collides false if not
  //  */
  // public checkCollision(car: Car): boolean {
  //   if (this.posX + 30 >= car.getPosX()
  //     && this.posX <= car.getPosX() + car.getWidth()
  //     && this.posY + 30 >= car.getPosY()
  //     && this.posY <= car.getPosY() + car.getHeight()) {
  //     return true;
  //   }
  //   return false;
  // }

  /**
   * Looks if answer is correct
   * @returns true or false
   */
  public isCorrectAnswer(): boolean {
    return this.isCorrect;
  }

  /**
   * shiii
   * @param text text
   * @param isCorrect looks if its correct
   * @returns a
   */
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
