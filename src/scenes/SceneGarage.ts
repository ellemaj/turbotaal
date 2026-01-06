import CanvasRenderer from '../CanvasRenderer.js';
import Vector2 from '../Vector2.js';
// import MouseListener, { MouseCoordinates } from '../MouseListener.js';
import KeyListener from '../KeyListener.js';
import Scene from './Scene.js';
import PlayerData from '../data/PlayerData.js';
import { getCarSkin } from '../data/CarSkins.js';
import { CarSkin } from '../data/CarSkin.js';
import { tryBuySkin } from '../data/CarSkins.js';
import SceneStart from './SceneStart.js';

export default class SceneGarage extends Scene {
  private returnScene: Scene;

  private goBack: boolean;

  private reset: boolean;

  private rotationAngle: number = 0;

  private coinImage: HTMLImageElement;

  private message: string | null = null;

  private messageTimer: number = 0;

  private messageType: 'success' | 'error' | null = null;

  public constructor(boardSize: Vector2, canvas: HTMLCanvasElement, returnScene: Scene) {
    super(boardSize, canvas);
    this.returnScene = returnScene;
    this.goBack = false;
    this.reset = false;

    this.coinImage = CanvasRenderer.loadNewImage('./assets/sprites/turbotoken.png');
    this.background = CanvasRenderer.loadNewImage('./assets/backgrounds/garage.png');
  }

  /**
   * Update function
   */
  public override update(delta: number): void {
    // 0.0015 is the rotationspeed
    this.rotationAngle += delta * 0.0015;

    if (this.messageTimer > 0) {
      this.messageTimer -= delta;
      if (this.messageTimer <= 0) {
        this.message = null;
        this.messageType = null;
      }
    }
  }

  private showMessage(
    text: string,
    type: 'success' | 'error'
  ): void {
    this.message = text;
    this.messageType = type;
    this.messageTimer = 2000; // ms
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
    if (keyListener.keyPressed(KeyListener.KEY_ESC)) {
      this.goBack = true;
    }

    if (keyListener.keyPressed(KeyListener.KEY_LEFT) ||
    keyListener.keyPressed(KeyListener.KEY_A)) {
      PlayerData.previousSkin();
    }

    if (keyListener.keyPressed(KeyListener.KEY_RIGHT) ||
      keyListener.keyPressed(KeyListener.KEY_D)) {
      PlayerData.nextSkin();
    }

    if (keyListener.keyPressed(KeyListener.KEY_ENTER)) {
      const index: number = PlayerData.getSkinIndex();
      const skin: CarSkin = getCarSkin(index);

      if (skin.unlocked) {
        PlayerData.selectSkin(index);
        this.showMessage('Skin geselecteerd!', 'success');
      } else {
        const succes: boolean = tryBuySkin(index);
        if (succes) {
          this.showMessage('🎉 Skin ontgrendeld!', 'success');
        } else {
          this.showMessage('Niet genoeg TurboTokens!', 'error');
        }
      }
    }
  }

  public override getNextScene(): Scene | null {
    if (this.goBack) {
      return this.returnScene;
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
    ctx.drawImage(this.background, 0, 0, canvas.width, canvas.height);

    // Render the coins
    const padding: number = 20;
    const coinSize: number = 32;

    ctx.drawImage(
      this.coinImage,
      canvas.width - 160,
      padding,
      coinSize,
      coinSize
    );

    ctx.font = '24px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    ctx.fillText(
      PlayerData.getCoins().toString(),
      canvas.width - 115,
      padding + 4
    );

    // Render the skin preview
    const skin: CarSkin = getCarSkin(PlayerData.getSkinIndex());

    const scale: number = 0.8;
    const previewWidth: number = skin.straight.width * scale;
    const previewHeight: number = skin.straight.height * scale;

    // const previewX: number = canvas.width / 2 - previewWidth / 2;
    const previewY: number = canvas.height / 2 - previewHeight / 2;

    ctx.save();

    // Move the car to the middle
    ctx.translate(
      canvas.width / 2,
      canvas.height / 2
    );

    // Rotate the car
    ctx.rotate(this.rotationAngle);

    // Render the car
    ctx.drawImage(
      skin.straight,
      -previewWidth / 2,
      -previewHeight / 2,
      previewWidth,
      previewHeight
    );

    // Restore canvas
    ctx.restore();

    // Selected or not?
    if (PlayerData.getSelectedSkin() === PlayerData.getSkinIndex()) {
      ctx.fillStyle = 'lightgreen';
      ctx.font = '22px Arial';
      ctx.textAlign = 'center';

      ctx.fillText(
        '✓ GESELECTEERD',
        canvas.width / 2,
        previewY - 20
      );
    }

    // Skin name
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';

    ctx.fillText(
      skin.name,
      canvas.width / 2,
      previewY + previewHeight + 40
    );

    // Locked or unlocked
    if (skin.unlocked) {
      ctx.fillStyle = 'lightgreen';
      ctx.fillText(
        'Press ENTER to select',
        canvas.width / 2,
        previewY + previewHeight + 80
      );
    } else {
      ctx.fillStyle = 'orange';
      ctx.fillText(
        'LOCKED - Press ENTER to buy',
        canvas.width / 2,
        previewY + previewHeight + 80
      );

      ctx.font = '20px Arial';
      ctx.fillText(
        `Price: ${skin.price}`,
        canvas.width / 2,
        previewY + previewHeight + 115
      );
    }

    if (this.message) {
      ctx.font = '30px Arial';
      ctx.textAlign = 'center';

      ctx.fillStyle =
        this.messageType === 'success' ? 'lightgreen' : 'orange';

      ctx.fillText(
        this.message,
        canvas.width / 2,
        canvas.height - 60
      );
    }
  }
}
