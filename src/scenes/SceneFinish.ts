import CanvasRenderer from '../CanvasRenderer.js';
import Vector2 from '../Vector2.js';
import MouseListener, { MouseCoordinates } from '../MouseListener.js';
import KeyListener from '../KeyListener.js';
import Scene from './Scene.js';
import PlayerData from '../data/PlayerData.js';
import SceneTrackSelection from './SceneTrackSelection.js';
import SceneStart from './SceneStart.js';
import RaceResult from '../data/RaceResult.js';

type SceneFactory = () => Scene;

export default class SceneFinish extends Scene {
  private goToTrackselection: boolean;

  private goToStart: boolean;

  private raceAgain: boolean;

  private earnedTurboTokens: number = 0;

  private earnedTurboCups: number = 0;

  private raceResult: RaceResult;

  private restartRace: SceneFactory;

  private confetti: {
    x: number;
    y: number;
    speed: number;
    size: number;
    color: string;
  }[] = [];

  public constructor(boardSize: Vector2,
    canvas: HTMLCanvasElement,
    raceResult: RaceResult,
    restartRace: SceneFactory,
    trackBackground: HTMLImageElement
  ) {
    super(boardSize, canvas);
    this.background = trackBackground;
    this.raceResult = raceResult;
    this.restartRace = restartRace;

    this.calculateRewards();
    this.saveRewards();

    this.goToTrackselection = false;
    this.goToStart = false;
    this.raceAgain = false;

    this.background = trackBackground;

    const colors: string[] = ['#FFD700', '#FF5252', '#40C4FF', '#69F0AE'];

    for (let i: number = 0; i < 80; i += 1) {
      this.confetti.push({
        x: Math.random() * this.boardSize.x,
        y: Math.random() * this.boardSize.y,
        speed: 2 + Math.random() * 4,
        size: 6 + Math.random() * 6,
        color: colors[i % colors.length] ?? '#FFFFFF',
      });
    }
  }

  /**
   * Update function
   */
  public override update(delta: number): void {
    for (const piece of this.confetti) {
      piece.y += piece.speed;

      if (piece.y > this.boardSize.y) {
        piece.y = -20;
        piece.x = Math.random() * this.boardSize.x;
      }
    }
  }

  /**
   * Process input
   *
   * @param keyListener keylistener
   * @param mouseListener mouselistener
   */
  public override processInput(
    keyListener: KeyListener
  ): void {
    if (keyListener.keyPressed(KeyListener.KEY_R)) {
      this.raceAgain = true;
    } else if (keyListener.keyPressed(KeyListener.KEY_ENTER)) {
      this.goToTrackselection = true;
    } else if (keyListener.keyPressed(KeyListener.KEY_ESC)) {
      this.goToStart = true;
    }
  }

  public override getNextScene(): Scene | null {
    if (this.goToTrackselection) {
      return new SceneTrackSelection(this.boardSize, this.canvas);
    } else if (this.goToStart) {
      return new SceneStart(this.boardSize, this.canvas);
    } else if (this.raceAgain) {
      return this.restartRace();
    }
    return null;
  }

  /**
   * Render
   */
  public override render(canvas: HTMLCanvasElement): void {
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    // Render the background
    ctx.drawImage(this.background, 0, 0, canvas.width, canvas.height);

    // Dark overlay to fade the background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX: number = canvas.width / 2;

    // Confetti effect
    for (const piece of this.confetti) {
      ctx.fillStyle = piece.color;
      ctx.fillRect(piece.x, piece.y, piece.size, piece.size * 1.8);
    }

    // Finish title
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.font = 'bold 90px Arial';
    ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
    ctx.fillText('FINISH!', centerX + 4, canvas.height * 0.18 + 4);

    ctx.fillStyle = '#FFD700';
    ctx.fillText('FINISH!', centerX, canvas.height * 0.18);

    // Stats
    let y: number = canvas.height * 0.35;

    ctx.font = '28px Arial';
    ctx.fillStyle = 'white';

    ctx.fillText(
      `Totale tijd: ${this.formatTime(this.raceResult.totalTime)}`,
      centerX,
      y
    );

    y += 40;
    ctx.fillText(`Aantal pitstops: ${this.raceResult.pitstopCount}`, centerX, y);

    y += 40;
    ctx.fillText(
      `Pitstop-tijd: +${this.formatTime(this.raceResult.pitstopPenaltyTime)}`,
      centerX,
      y
    );

    y += 60;

    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = 'white';

    // TurboCups(totaal)
    ctx.drawImage(this.turboCup, centerX - 200, y - 24, 48, 48);
    ctx.fillText(`TurboCups: ${PlayerData.getTurboCups()}`, centerX, y);

    // TurboTokens(totaal)
    y += 70;
    ctx.drawImage(this.turboToken, centerX - 210, y - 24, 48, 48);
    ctx.fillText(`TurboTokens: ${PlayerData.getTurboTokens()}`, centerX, y);

    // Earned rewards (this race)
    y += 50;

    ctx.font = 'bold 30px Arial';
    ctx.fillStyle = '#FFD700';
    ctx.fillText(`+${this.earnedTurboTokens} TurboTokens`, centerX, y);

    y += 40;
    ctx.fillStyle = '#40C4FF';
    ctx.fillText(`+${this.earnedTurboCups} TurboCups`, centerX, y);

    // Buttons
    const buttonY: number = canvas.height * 0.78;

    ctx.font = '28px Arial';
    ctx.fillStyle = 'white';

    ctx.fillText('[R] Race opnieuw', centerX, buttonY);
    ctx.fillText('[ENTER] Trackselectie', centerX, buttonY + 45);
    ctx.fillText('[ESC] Main menu', centerX, buttonY + 90);
  }

  private calculateRewards(): void {
    const time: number = this.raceResult.totalTime;

    // Number of TurboTokens earned based on the racetime
    if (time < 60_000) {
      this.earnedTurboTokens = 120;
    } else if (time < 75_000) {
      this.earnedTurboTokens = 90;
    } else if (time < 95_000) {
      this.earnedTurboTokens = 60;
    } else {
      this.earnedTurboTokens = 20;
    }

    // Number of TurboCups earned based on the racetime
    if (time < 65_000) {
      this.earnedTurboCups = 3;
    } else if (time < 80_000) {
      this.earnedTurboCups = 2;
    } else if (time < 95_000) {
      this.earnedTurboCups = 1;
    } else {
      this.earnedTurboCups = 0;
    }
  }

  private saveRewards(): void {
    PlayerData.addTurboTokens(this.earnedTurboTokens);
    PlayerData.addTurboCups(this.earnedTurboCups);
  }

  private formatTime(ms: number): string {
    const totalSeconds: number = ms / 1000;
    const minutes: number = Math.floor(totalSeconds / 60);
    const seconds: number = Math.floor(totalSeconds % 60);
    const millis: number = Math.floor(ms % 1000);

    return `${minutes}:${seconds.toString().padStart(2, '0')}.${millis
      .toString()
      .padStart(3, '0')}`;
  }
}
