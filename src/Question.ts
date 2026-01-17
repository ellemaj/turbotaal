import CanvasItem from './CanvasItem.js';
import Answer from './Answer.js';
import { Question as QuestionType } from './questions/types.js';
import CanvasRenderer from './CanvasRenderer.js';

export default class Question extends CanvasItem {
  private questionText: string;

  private difficulty: number; // 1 through 3

  private answers: Answer[];

  public selectedAnswerIndex: number;

  public constructor() {
    super();
    this.questionText = '';
    this.difficulty = 1;
    this.answers = [];
    this.selectedAnswerIndex = 0;
  }

  /**
   * Checks the difficulty of the questions
   * @returns the difficulty
   */
  public checkDifficulty(): number {
    return this.difficulty;
  }

  /**
   * Render the question and answers
   *
   * @param canvas: the canvas it needs to render on
   */
  public draw(canvas: HTMLCanvasElement): void {
    // center text
    const centerX: number = canvas.width / 2;
    const questionY: number = 100;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    const rectWidth: number = canvas.width / 3;
    const rectHeight: number = canvas.height / 5;
    const rectangleX: number = (canvas.width - rectWidth) / 2;
    const rectangleY: number = canvas.height * 0.1;
    ctx.fillStyle = 'rgba(30, 37, 43, 0.85)';
    ctx.fillRect(rectangleX, rectangleY, rectWidth, rectHeight);

    // draw question text in center
    CanvasRenderer.writeText(canvas, this.questionText, centerX, questionY, 'center', 'Arial', 22, '#F2F4F6');

    // draw answer text under question
    const lineHeight: number = 28;
    this.answers.forEach((ans: Answer, i: number) => {
      const textY: number = questionY + 30 + i * lineHeight;
      const labelText: string = `${i + 1}. ${ans.getText()}`;
      CanvasRenderer.writeText(canvas, labelText, centerX, textY, 'center', 'Arial', 18, '#C9D1D9');
    });
  }

  /**
   * Load a new question
   *
   * @param question questiontype
   */
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
   * Check the answer at the given index
   *
   * @returns true or false
   */
  public checkAnswerAt(index: number): boolean {
    return this.answers[index]?.isCorrectAnswer() ?? false;
  }
}
