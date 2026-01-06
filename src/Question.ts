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

    // // draw 3 boxes (1-3 antwoorden)
    // const boxWidth: number = 30;
    // const boxHeight: number = 30;
    // const spacing: number = 300;
    // const totalWidth: number = 3 * boxWidth + 2 * spacing;
    // const startX: number = centerX - totalWidth / 2;
    // const boxesY: number = questionY + 30 + this.answers.length * lineHeight + 20;

    // this.answers.forEach((ans: Answer, i: number) => {
    //   const x: number = startX + i * (boxWidth + spacing);
    //   const y: number = boxesY;

    //   // draw answerbox (positions in setPosition())
    //   CanvasRenderer.drawAnswerBox(
    // canvas, x, y, boxWidth, boxHeight, 'blue', `${i + 1}`, 'white', '20px Arial');
    // });
  }

  public spawnBoxes(canvas: HTMLCanvasElement, camera: Camera): void {
    const boxWidth: number = 40;
    const boxHeight: number = 40;
    const spacing: number = 30;
    const spawncoordinates: [number, number][] = [
      [160, 600],
      [1630, 375],
      [612, 265]
    ];
    spawncoordinates.forEach(([baseX, baseY]: [number, number]) => {
      for (let i: number = 0; i < 3; i++) {
        const x: number = baseX + i * (boxWidth + spacing);
        const y: number = baseY;

        CanvasRenderer.drawAnswerBox(
          canvas,
          x - camera.position.x,
          y - camera.position.y,
          boxWidth,
          boxHeight,
          'gold',
          `${i + 1}`,
          'white',
          '20px Arial'
        );
        console.log('boxes', x, y);
      };
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

  public checkAnswerAt(index: number): boolean {
    return this.answers[index]?.isCorrectAnswer() ?? false;
  }
}
