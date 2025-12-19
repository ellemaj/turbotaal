import Vector2 from './Vector2.js';

export default class Camera {
  public position: Vector2;

  public zoom: number;

  private viewportWidth: number;

  private viewportHeight: number;

  public constructor(viewportWidth: number, viewportHeight: number, zoom: number = 1) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.zoom = zoom;

    this.position = new Vector2(0, 0);
  }

  /**
   * Center the camera on a target (like the car)
   */
  public follow(target: Vector2): void {
    this.position.x = target.x - (this.viewportWidth / 2) / this.zoom;
    this.position.y = target.y - (this.viewportHeight / 2) / this.zoom;
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
