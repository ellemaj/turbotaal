import Vector2 from './Vector2.js';

export default class Camera {
  public position: Vector2;

  public zoom: number;

  private viewportWidth: number;

  private viewportHeight: number;

  private worldWidth: number;

  private worldHeight: number;

  public constructor(
    viewportWidth: number,
    viewportHeight: number,
    worldWidth: number,
    worldHeight: number,
    zoom: number = 1
  ) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.zoom = zoom;

    this.position = new Vector2(0, 0);
  }


  /**
   * Center the camera on a target (like the car)
   */
  public follow(target: Vector2): void {
    const halfW: number = (this.viewportWidth / this.zoom) / 2;
    const halfH: number = (this.viewportHeight / this.zoom) / 2;

    let x: number = target.x - halfW;
    let y: number = target.y - halfH;

    // clamp X
    x = Math.max(0, Math.min(x, this.worldWidth - halfW * 2));
    // clamp Y
    y = Math.max(0, Math.min(y, this.worldHeight - halfH * 2));

    this.position.x = x;
    this.position.y = y;
  }


  /**
   * Apply camera transform to the canvas
   */
  public apply(ctx: CanvasRenderingContext2D): void {
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.position.x, -this.position.y);
  }

  public begin(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.position.x, -this.position.y);
  }

  public end(ctx: CanvasRenderingContext2D): void {
    ctx.restore();
  }
}
