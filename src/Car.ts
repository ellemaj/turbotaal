import CanvasItem from './CanvasItem.js';
import Vector2 from './Vector2.js';
import Grid from './Grid.js';
import PlayerData from './data/PlayerData.js';
import type { CarSkin } from './data/CarSkin.js';
import { getCarSkin } from './data/CarSkins.js';

import Health from './Health.js';
export default class Car extends CanvasItem {
  private rotation: number = -2;

  private speed: number = 0;

  private scale: number = 0.28; // Scaling for the car (0.28 is standard)

  public maxSpeed: number = 0.2;

  public movingLeft: boolean = false;

  public movingRight: boolean = false;

  public movingUp: boolean = false;

  public movingDown: boolean = false;

  public turnSpeed: number = 4;

  private position: Vector2;

  private previousPosition: Vector2;

  private health: Health;

  public constructor() {
    super();

    const skin: CarSkin = getCarSkin(PlayerData.getSkinIndex());
    this.image = skin.straight;

    this.position = new Vector2(0, 0);
    this.previousPosition = this.position.clone();
    this.rotation = 0;
    this.health = new Health;
  }

  public getPosition(): Vector2 {
    return this.position;
  }

  /**
   * Updates the car
   *
   * @param delta Elapsed time
   * @param canvas The canvas it needs to be rendered on
   */
  public update(delta: number, canvas: HTMLCanvasElement, grid: Grid): void {
    const skin: CarSkin = getCarSkin(PlayerData.getSkinIndex());

    // Change skins when steering
    if (this.movingLeft && !this.movingRight) {
      this.image = skin.left;
    } else if (this.movingRight && !this.movingLeft) {
      this.image = skin.right;
    } else {
      this.image = skin.straight;
    }

    // Movement
    if (this.movingLeft && this.speed != 0) {
      this.rotation -= (Math.PI * (delta / this.turnSpeed) / 180);
      this.movingLeft = false;
    }
    if (this.movingRight && this.speed != 0) {
      this.rotation += (Math.PI * (delta / this.turnSpeed) / 180);
      this.movingRight = false;
    }
    if (this.movingUp && !this.movingDown) {
      this.speed += 0.005 * delta;
    } else {
      this.speed -= 0.01 * delta;
      if (this.speed < 0) {
        this.speed = 0;
      }
    }
    if (this.movingDown) {
      if (this.speed <= 0) {
        this.speed -= 0.005 * delta;
      } else {
        this.speed -= 0.0005 * delta;
      }
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    this.previousPosition = this.position.clone();
    this.position.x -= Math.cos(this.rotation + Math.PI / 2) * this.speed * delta;
    this.position.y -= Math.sin(this.rotation + Math.PI / 2) * this.speed * delta;


    // car hitbox accurate maker tm
    const tileSize: number = grid.getTileSize();
    const carWidth: number = this.image.width * this.scale;
    const carHeight: number = this.image.height * this.scale;

    // edging auto
    const left: number = this.position.x;
    const right: number = this.position.x + carWidth;
    const top: number = this.position.y;
    const bottom: number = this.position.y + carHeight;

    // look where the edges are
    const leftTile: number = Math.floor(left / tileSize);
    const rightTile: number = Math.floor(right / tileSize);
    const topTile: number = Math.floor(top / tileSize);
    const bottomTile: number = Math.floor(bottom / tileSize);

    // check all tiles of which the car is currently colliding with (holy engels)
    let collision: boolean = false;
    for (let col: number = leftTile; col <= rightTile; col++) {
      for (let row: number = topTile; row <= bottomTile; row++) {
        if (grid.getCollision(col, row)) {
          collision = true;
          break;
        }
      }
      if (collision) {
        this.health.setColliding(true);
        this.health.updateHealth();
        this.health.setColliding(false);
        break;
      }
    }


    if (collision) {
      this.position = this.previousPosition.clone();
      this.speed = 0;
    }

    const tilePos: { col: number; row: number } =
      this.getTilePosition(tileSize);

    if (grid.getCollision(tilePos.col, tilePos.row)) {
      // revert to last pos pluh
      this.position = this.previousPosition.clone();
      this.speed = 0;
    }
    // // Ensures that te car cannot drive out of your screen
    // const carWidth: number = this.image.width * this.scale;
    // const carHeight: number = this.image.height * this.scale;

    // if (this.posX < 0) {
    //   this.posX = 0;
    // }
    // if (this.posY < 0) {
    //   this.posY = 0;
    // }
    // if (this.posX + carWidth > canvas.width) {
    //   this.posX = canvas.width - carWidth;
    // }
    // if (this.posY + carHeight > canvas.height) {
    //   this.posY = canvas.height - carHeight;
    // }
  }

  /**
   * Render the car
   *
   * @param canvas The canvas the car needs to be rendered on
   */
  public override render(canvas: HTMLCanvasElement): void {
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.save();

    ctx.translate(
      this.position.x + (this.image.width * this.scale) / 2,
      this.position.y + (this.image.height * this.scale) / 2
    );


    ctx.rotate(this.rotation);
    ctx.scale(this.scale, this.scale);

    ctx.drawImage(
      this.image,
      -(this.image.width / 2),
      -(this.image.height / 2)
    );

    ctx.restore();
  }

  public setScale(scale: number): void {
    this.scale = scale;
  }


  public setStartPosition(x: number, y: number, rotation: number): void {
    this.position.x = x;
    this.position.y = y;
    this.rotation = rotation;
    this.speed = 0;
  }

  public resetPosition(canvas: HTMLCanvasElement): void {
    this.position.x = canvas.width * 0.5;
    this.position.y = canvas.height * 0.285;
    this.rotation = 1.085;
    this.speed = 0;
  }

  public getHealth(): Health {
    return this.health;
  }

  //Tile position for collision (oh bars)
  public getTilePosition(tileSize: number): { col: number; row: number } {
    return {
      col: Math.floor(this.position.x / tileSize),
      row: Math.floor(this.position.y / tileSize),
    };
  }
}
