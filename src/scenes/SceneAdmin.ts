import Scene from './Scene.js';
import KeyListener from '../KeyListener.js';
import Vector2 from '../Vector2.js';
import PlayerData from '../data/PlayerData.js';
import SceneStart from './SceneStart.js';
import MouseListener from '../MouseListener.js';

// Admin function for debugging
export default class SceneAdmin extends Scene {
  private lapInput: string = '';

  private input: string = '';

  private loggedIn: boolean = false;

  private goToStart: boolean = false;

  private readonly ADMIN_CODE: string = 'turboadmin123';

  public constructor(boardSize: Vector2, canvas: HTMLCanvasElement) {
    super(boardSize, canvas);
  }

  /**
   * Process input
   * @param keyListener keylistener that is used
   * @param mouseListener mouselistener that is used
   */
  public override processInput(keyListener: KeyListener, mouseListener: MouseListener): void {
    // Letters and numbers
    if (!this.loggedIn) {
      for (const key of [
        KeyListener.KEY_A, KeyListener.KEY_D, KeyListener.KEY_M, KeyListener.KEY_I,
        KeyListener.KEY_N, KeyListener.KEY_T, KeyListener.KEY_U, KeyListener.KEY_R,
        KeyListener.KEY_B, KeyListener.KEY_O,
        KeyListener.KEY_1, KeyListener.KEY_2, KeyListener.KEY_3
      ]) {
        if (keyListener.keyPressed(key)) {
          this.input += key.replace('Key', '').replace('Digit', '').toLowerCase();
        }
      }

      // Backspace
      if (keyListener.keyPressed(KeyListener.KEY_BACKSPACE)) {
        this.input = this.input.slice(0, -1);
      }

      // Enter = login check
      if (keyListener.keyPressed(KeyListener.KEY_ENTER)) {
        if (this.input === this.ADMIN_CODE) {
          PlayerData.addTurboCups(999);
          PlayerData.addTurboTokens(999);
          this.loggedIn = true;
        }
      }
    }


    // Only if logged in
    if (this.loggedIn) {
      // Numbers 1 - 9
      for (const key of [
        KeyListener.KEY_1,
        KeyListener.KEY_2,
        KeyListener.KEY_3,
        KeyListener.KEY_4,
        KeyListener.KEY_5,
        KeyListener.KEY_6,
        KeyListener.KEY_7,
        KeyListener.KEY_8,
        KeyListener.KEY_9,
      ]) {
        if (keyListener.keyPressed(key)) {
          this.lapInput += key.replace('Digit', '');
        }
      }

      if (keyListener.keyPressed(KeyListener.KEY_BACKSPACE)) {
        this.lapInput = this.lapInput.slice(0, -1);
      }
    }

    // Enter = save laps
    if (keyListener.keyPressed(KeyListener.KEY_ENTER) && this.lapInput !== '') {
      PlayerData.setMaxLaps(Number(this.lapInput));
      this.lapInput = '';
    }

    if (this.loggedIn && keyListener.keyPressed(KeyListener.KEY_ESC)) {
      this.goToStart = true;
    }
  }

  /**
   * Update
   * @param _ yes
   */
  public override update(_: number): void { }

  public override getNextScene(): Scene | null {
    if (this.goToStart) {
      return new SceneStart(this.boardSize, this.canvas);
    }
    return null;
  }

  /**
   * Render
   * @param canvas canvas it needs to be rendered on
   * @returns yes
   */
  public override render(canvas: HTMLCanvasElement): void {
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';

    ctx.fillText('ADMIN LOGIN', canvas.width / 2, 150);
    ctx.fillText('Code:', canvas.width / 2, 250);
    ctx.fillText(this.input.replace(/./g, '*'), canvas.width / 2, 320);

    ctx.font = '24px Arial';
    ctx.fillText('Druk ENTER om in te loggen', canvas.width / 2, 400);

    if (this.loggedIn) {
      ctx.font = '26px Arial';
      ctx.fillText(
        `Max laps: ${PlayerData.getMaxLaps()}`,
        canvas.width / 2,
        480
      );

      ctx.fillText(
        'Type nieuw aantal laps + ENTER',
        canvas.width / 2,
        520
      );

      ctx.fillText(
        this.lapInput,
        canvas.width / 2,
        560
      );
    }
  }
}
