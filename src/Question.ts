import CanvasItem from './CanvasItem.js';
import Answer from './Answer.js';
import Car from './Car.js';
import { Question as QuestionType } from './questions/types.js';
import CanvasRenderer from './CanvasRenderer.js';
import Camera from './Camera.js';

export default class Question extends CanvasItem {
  private isActive: boolean;

  private isResolved: boolean;

  private questionText: string;

  private difficulty: number; //1 through 3

  private answers: Answer[];

  public selectedAnswerIndex: number;

  public constructor() {
    super();
    this.isActive = false;
    this.isResolved = false;
    this.questionText = '';
    this.difficulty = 1;
    this.answers = [];
    this.selectedAnswerIndex = 0;
  }

  /**
   *
   */
  public checkDifficulty(): number {
    return this.difficulty;
  }

  /**
   *
   */
  public draw(canvas: HTMLCanvasElement): void {
    // center text
    const centerX: number = canvas.width / 2;
    const questionY: number = 100;

    // draw question text in center
    CanvasRenderer.writeText(canvas, this.questionText, centerX, questionY, 'center', 'Arial', 22, 'black');

    // draw answer text under question
    const lineHeight: number = 28;
    this.answers.forEach((ans: Answer, i: number) => {
      const textY: number = questionY + 30 + i * lineHeight;
      const labelText: string = `${i + 1}. ${ans.getText()}`;
      CanvasRenderer.writeText(canvas, labelText, centerX, textY, 'center', 'Arial', 18, 'black');
    });
  }

  public loadFromData(question: QuestionType): void {
    this.questionText = question.question;
    this.answers = question.answers.map((text: string, i: number) => {
      const ans: Answer = Answer.from(text, i === question.correct);
      const boxX: number = this.posX + i;
      ans.setPosition(boxX, this.posY + 100);
      return ans;
    });
  }

  public setPosition(x: number, y: number): void {
    this.posX = x;
    this.posY = y;
  }

  public getAnswerIndex(index: number): Answer | undefined {
    return this.answers[index];
  }

  /**
   *
   */
  public checkAnswerAt(index: number): boolean {
    return this.answers[index]?.isCorrectAnswer() ?? false;
  }
}
