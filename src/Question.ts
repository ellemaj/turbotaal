import CanvasItem from './CanvasItem.js';
import Answer from './Answer.js';
import { verkleinwoorden } from './questions/verkleinwoorden.js';
import { Question as QuestionType } from './questions/types.js';
import CanvasRenderer from './CanvasRenderer.js';

export default class Question extends CanvasItem {
  private isActive: boolean;

  private isResolved: boolean;

  private questionText: string;

  private difficulty: number; //1 through 3

  private answers: Answer[];

  public constructor() {
    super();
    this.isActive = false;
    this.isResolved = false;
    this.questionText = '';
    this.difficulty = 1;
    this.answers = [];
  }

  public checkDifficulty(): number {
    return this.difficulty;
  }

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

    // draw 3 boxes (1-3 antwoorden)
    const boxWidth: number = 50;
    const boxHeight: number = 50;
    const spacing: number = 200;
    const totalWidth: number = 3 * boxWidth + 2 * spacing;
    const startX: number = centerX - totalWidth / 2;
    const boxesY: number = questionY + 30 + this.answers.length * lineHeight + 20;

    this.answers.forEach((ans: Answer, i: number) => {
      const x: number = startX + i * (boxWidth + spacing);
      const y: number = boxesY;

      // update answer pos (later collision)
      // ans.setPosition(x, y);

      // draw answerbox
      CanvasRenderer.drawAnswerBox(canvas, x, y, boxWidth, boxHeight, 'blue', `${i + 1}`, 'white', '20px Arial');
    });
  }

  public loadFromData(question: QuestionType): void {
    this.questionText = question.question;
    this.answers = question.answers.map((text: string, i: number) => {
      const ans: Answer = Answer.from(text, i === question.correct);
      const boxX: number = this.posX + i * 270; // 3 boxes, elk 270px uit elkaar
      ans.setPosition(boxX, this.posY + 100);
      return ans;
    });
  }

  public setPosition(x: number, y: number): void {
    this.posX = x;
    this.posY = y;
    this.answers.forEach((ans: Answer, i: number) => {
      ans.setPosition(this.posX + i * 270, this.posY + 100);
    });
  }
}
