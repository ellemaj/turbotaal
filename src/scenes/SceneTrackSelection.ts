import CanvasRenderer from '../CanvasRenderer.js';
import KeyListener from '../KeyListener.js';
import Vector2 from '../Vector2.js';
import Racetrack1 from './Racetrack1.js';
import Racetrack2 from './Racetrack2.js';
import Racetrack3 from './Racetrack3.js';
import SceneStart from './SceneStart.js';
import Scene from './Scene.js';
import Grid from '../Grid.js';
import PlayerData from '../data/PlayerData.js';
import MouseListener, { MouseCoordinates } from '../MouseListener.js';

export default class SceneTrackSelection extends Scene {
  // Number of TurboCups needed to unlock the racetrack
  private readonly TRACK_REQUIREMENTS: number[] = [0, 5, 10];

  private raceTrack1: boolean;

  private raceTrack2: boolean;

  private raceTrack3: boolean;

  private goBack: boolean;

  private grid: Grid;

  private racetrack1Button: HTMLImageElement;

  private racetrack2Button: HTMLImageElement;

  private racetrack3Button: HTMLImageElement;

  private logoScale: number;

  private hoveredButton: number | null = null;

  public constructor(boardSize: Vector2, canvas: HTMLCanvasElement) {
    super(boardSize, canvas);
    this.raceTrack1 = false;
    this.raceTrack2 = false;
    this.raceTrack3 = false;
    this.goBack = false;

    this.background = CanvasRenderer.loadNewImage('./assets/backgrounds/trackselection.png');
    this.racetrack1Button = CanvasRenderer.loadNewImage('./assets/buttons/racetrack1.png');
    this.racetrack2Button = CanvasRenderer.loadNewImage('./assets/buttons/racetrack2.png');
    this.racetrack3Button = CanvasRenderer.loadNewImage('./assets/buttons/racetrack3.png');

    this.grid = new Grid(30, 20, []);

    this.logoScale = 0.4;
    this.scale = 0.35;

    this.showBackButton = true;
  }

  private isTrackUnlocked(index: number): boolean {
    const required: number | undefined = this.TRACK_REQUIREMENTS[index];
    if (required === undefined) {
      return false;
    }
    return PlayerData.getTurboCups() >= required;
  }

  /**
   * Goes to the racetrack when the right key is pressed
   *
   * @param keyListener Looks if the key is being pressed
   */
  public override processInput(keyListener: KeyListener, mouseListener: MouseListener): void {
    if (keyListener.keyPressed(KeyListener.KEY_1)) {
      this.raceTrack1 = true;
    } else if (keyListener.keyPressed(KeyListener.KEY_2) && this.isTrackUnlocked(1)) {
      this.raceTrack2 = true;
    } else if (keyListener.keyPressed(KeyListener.KEY_3) && this.isTrackUnlocked(2)) {
      this.raceTrack3 = true;
    } else if (keyListener.keyPressed(KeyListener.KEY_ESC)) {
      this.goBack = true;
    }

    this.updateBackButton(
      this.mouseListener.getMousePosition(),
      this.mouseListener.buttonPressed(MouseListener.BUTTON_LEFT)
    );

    // Mouseclick
    if (mouseListener.buttonPressed(MouseListener.BUTTON_LEFT)) {
      if (this.hoveredButton === 0) {
        this.raceTrack1 = true;
      } else if (this.hoveredButton === 1 && this.isTrackUnlocked(1)) {
        this.raceTrack2 = true;
      } else if (this.hoveredButton === 2 && this.isTrackUnlocked(2)) {
        this.raceTrack3 = true;
      }
    }
  }

  /**
   * Update the trackselection-scene
   */
  public override update(): void {
    if (this.backClicked) {
      this.goBack = true;
      this.backClicked = false;
    }
  }

  public override getNextScene(): Scene | null {
    if (this.raceTrack1) {
      return new Racetrack1(this.boardSize, this.canvas, this.grid);
    } else if (this.raceTrack2) {
      return new Racetrack2(this.boardSize, this.canvas, this.grid);
    } else if (this.raceTrack3) {
      return new Racetrack3(this.boardSize, this.canvas, this.grid);
    } else if (this.goBack) {
      return new SceneStart(this.boardSize, this.canvas);
    }
    return null;
  }

  /**
   * Render the things on the TrackSelection scene
   *
   * @param canvas the canvas it needs to be rendered on
   */
  public override render(canvas: HTMLCanvasElement): void {
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    // Render the background
    ctx.drawImage(this.background, 0, 0, canvas.width, canvas.height);

    const centerX: number = canvas.width / 2;
    let currentY: number = canvas.height * 0.06;
    const spacing: number = 100; // Room between the buttons

    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';

    // Render the logo
    const logoWidth: number = this.logo.width * this.logoScale;
    const logoHeight: number = this.logo.height * this.logoScale;

    ctx.drawImage(
      this.logo,
      centerX - logoWidth / 2,
      currentY,
      logoWidth, logoHeight
    );
    currentY += logoHeight + spacing;

    // Render the racetrackbuttons
    const buttonY: number = currentY + 30;
    const gap: number = 60; // room between the buttons
    const buttonWidth: number = this.racetrack1Button.width * this.scale;
    const buttonHeight: number = this.racetrack1Button.height * this.scale;

    const buttons: HTMLImageElement[] = [
      this.racetrack1Button,
      this.racetrack2Button,
      this.racetrack3Button,
    ];

    const trackRequirements: number[] = [0, 5, 10];
    const cups: number = PlayerData.getTurboCups();

    const totalWidth: number = buttons.length * buttonWidth + (buttons.length - 1) * gap;
    const startX: number = centerX - totalWidth / 2;

    this.hoveredButton = null;
    const mouse: MouseCoordinates = this.mouseListener.getMousePosition();

    for (let i: number = 0; i < buttons.length; i++) {
      const x: number = startX + i * (buttonWidth + gap);
      const y: number = buttonY;

      const required: number | undefined = trackRequirements[i];
      const unlocked: boolean = required !== undefined && cups >= required;

      const isHover: boolean =
        unlocked &&
        mouse.x >= x &&
        mouse.x <= x + buttonWidth &&
        mouse.y >= y &&
        mouse.y <= y + buttonHeight;

      if (isHover) {
        this.hoveredButton = i;
      }

      // Locked = transparent
      ctx.globalAlpha = unlocked ? 1 : 0.4;

      // Hoveranimation
      const scale: number = isHover ? 1.1 : 1;
      const w: number = buttonWidth * scale;
      const h: number = buttonHeight * scale;

      const img: HTMLImageElement | undefined = buttons[i];
      if (!img) {
        continue;
      }

      ctx.drawImage(
        img,
        x - (w - buttonWidth) / 2,
        y - (h - buttonHeight) / 2,
        w,
        h
      );

      // Locked text
      if (!unlocked) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'white';
        ctx.font = '25px Arial';
        ctx.fillText(
          `${trackRequirements[i]} TurboCups nodig`,
          x + buttonWidth / 2,
          y + buttonHeight + 20
        );
      }

      ctx.globalAlpha = 1;
    }

    // Render the turbocups
    const padding: number = 20;
    const cupSize: number = 40;

    ctx.drawImage(
      this.turboCup,
      canvas.width - 120,
      padding,
      cupSize,
      cupSize
    );

    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    ctx.fillText(
      PlayerData.getTurboCups().toString(),
      canvas.width - 65,
      padding + 8
    );

    this.renderBackButton(ctx);
  }
}
